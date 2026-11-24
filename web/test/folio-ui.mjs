import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const assets=resolve(process.env.PHONE_PREVIEW_ASSETS || fileURLToPath(new URL('../../app/src/main/assets/analysis',import.meta.url)));
const out=resolve(process.env.PHONE_PREVIEW_OUTPUT || fileURLToPath(new URL('../../docs/previews',import.meta.url)));
await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{
  const path=req.url==='/'?'index.html':req.url.slice(1);
  if(!/^[a-z0-9A-Z._/-]+$/.test(path)||path.includes('..'))return res.writeHead(404).end();
  try{const file=await readFile(assets+'/'+path);res.writeHead(200,{'Content-Type':{html:'text/html',css:'text/css',js:'text/javascript',svg:'image/svg+xml',ttf:'font/ttf'}[path.split('.').pop()]||'application/octet-stream'}).end(file)}
  catch{res.writeHead(404).end()}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.PHONE_PREVIEW_CHROMIUM?{executablePath:process.env.PHONE_PREVIEW_CHROMIUM}:{})});
try{
  for(const [width,height] of [[360,640],[390,780]]){
    const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:'+server.address().port);
    await page.waitForFunction(()=>window.Folio && !document.documentElement.classList.contains('board-assets-loading'));
    await page.evaluate(()=>document.fonts.ready);
    // Play a small study through the actual board, without a native engine or any account.
    const sq=async name=>{const b=await page.locator('#board').boundingBox();await page.touchscreen.tap(b.x+(name.charCodeAt(0)-97+.5)*b.width/8,b.y+(8-Number(name[1])+.5)*b.height/8)};
    for(const mv of ['e2e4','e7e5','g1f3','b8c6']){await sq(mv.slice(0,2));await sq(mv.slice(2))}
    await page.locator('[data-tab=moves]').click();
    assert.match(await page.locator('#panel').innerText(),/Nc6/);
    // Chessground animates pieces in its own frame loop; capture the settled position.
    await page.waitForTimeout(400);
    await page.screenshot({path:out+'/folio-board-'+width+'.png'});
    await page.locator('[data-open-contents]').click();
    assert.equal(await page.locator('#app').getAttribute('inert'),'');
    await page.locator('[data-chapter=collection]').click();
    await page.screenshot({path:out+'/folio-contents-'+width+'.png'});
    await page.evaluate(()=>{window.calls=[];window.InstinctaZeroNative={openFolioPage:p=>window.calls.push(p)}});
    await page.locator('[data-destination=library]').click();await page.locator('[data-destination=backups]').click();
    assert.deepEqual(await page.evaluate(()=>window.calls),['library','backups']);
    await page.evaluate(()=>delete window.InstinctaZeroNative);
    await page.locator('[data-chapter=setup]').click();await page.locator('[data-destination=Stockfish]').click();
    assert.equal(await page.locator('#board-wrap').isVisible(),false);assert.equal(await page.locator('#panel [data-fish=full]').isVisible(),true);
    await page.screenshot({path:out+'/folio-stockfish-'+width+'.png'});
    assert.equal(await page.evaluate(()=>window.Folio.back()),true);await page.waitForFunction(()=>document.querySelector('#board').offsetWidth>0);
    assert.match(await page.locator('#panel').innerText(),/Nc6/);
    await page.locator('[data-open-contents]').click();await page.locator('[data-chapter=position]').click();await page.locator('[data-destination=editor]').click();
    assert.equal(await page.locator('#position-editor').isVisible(),true);assert.equal(await page.evaluate(()=>window.Folio.back()),true);
    await page.locator('[data-tab=chart]').click();assert.equal(await page.locator('[data-open-engines]').isVisible(),true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);
    console.log(width+'x'+height+': moves, Contents, native dispatch, engine settings, editor, Back and viewport passed.');await page.close();
  }
}finally{await browser.close();server.close()}
