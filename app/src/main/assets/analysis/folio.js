/* Folio desk: navigating the contents never reconstructs a board, parser, or study. */
(() => {
  'use strict';
  const desk=document.querySelector('#app'), contents=document.querySelector('#folio-contents');
  const nav=document.querySelector('.index-chapters'), list=document.querySelector('#index-rows');
  const core=window.InstinctaZero;
  let chapter='position', foreground=true, lastFocus=null;
  const destinations={
    position:[['moves','Notation','branch'],['engine','Engine lines','wave'],['book','Opening explorer','book'],['editor','Edit position','grid'],['study','Study tools','file']],
    collection:[['library','Repertoire library','shelf'],['repertoire','Repertoire board','book'],['games','Completed games','grid'],['backups','PC backups','archive']],
    setup:[['Board','Board & input','grid'],['Leela','Leela','wave'],['Stockfish','Stockfish','wave'],['bookSettings','Explorer filters','filter'],['connection','PC connection','link'],['privacy','Display privacy','eye']]
  };
  const icons={branch:'M5 3v17m13-16v3c0 4-3 5-7 5H5',wave:'M2 13h4l3-7 4 13 3-9 2 3h4',book:'M3 5q5-2 9 1v14q-4-3-9-1zM12 6q5-3 9-1v14q-5-2-9 1',grid:'M3 3h18v18H3zM3 12h18M12 3v18',file:'M5 3h10l4 5v13H5zM8 12h8m-8 4h6',shelf:'M4 5v15m5-16v16m5-14 5 14M2 21h19',archive:'M3 4h18v4H3zM5 8v12h14V8M9 12h6',filter:'M3 6h18M6 12h12m-9 6h6',link:'M9 15l6-6M9 9l3-3q4-4 7 0t-1 7l-2 2M8 9l-3 3q-4 4 0 7t7-1l2-2',eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zM10 12a2 2 0 1 0 4 0 2 2 0 1 0 -4 0'};
  const nativePages=new Set(['library','games','backups','connection','privacy']);
  function paint() {
    nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.chapter===chapter)));
    list.replaceChildren();
    for(const [page,label,icon] of destinations[chapter]){
      const row=document.createElement('button');
      row.className='index-row';row.dataset.destination=page;
      // All fragments are closed, local constants. No identity or study text enters markup.
      row.innerHTML='<svg class="row-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="'+icons[icon]+'"/></svg><span>'+label+'</span><svg class="row-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
      list.append(row);
    }
    list.scrollTop=0;
  }
  function activate(){core.setAnalysisActive(foreground && contents.hidden)}
  function openIndex(){
    if(!contents.hidden)return;
    lastFocus=document.activeElement;
    desk.inert=true;desk.setAttribute('aria-hidden','true');
    contents.hidden=false;paint();activate();contents.querySelector('h1').focus({preventScroll:true});
  }
  function resumeBoard(){
    if(contents.hidden)return;
    contents.hidden=true;desk.inert=false;desk.removeAttribute('aria-hidden');
    if(lastFocus && lastFocus.isConnected)lastFocus.focus({preventScroll:true});
    activate();
  }
  function route(page){
    if(nativePages.has(page)){
      if(window.InstinctaZeroNative?.openFolioPage)window.InstinctaZeroNative.openFolioPage(page);
      else {
        let status=list.querySelector('[role=status]');
        if(!status){status=document.createElement('p');status.setAttribute('role','status');list.append(status)}
        status.textContent='Open this destination in the Android app.';
      }
      return;
    }
    resumeBoard();core.folioOpen(page);
  }
  document.querySelector('[data-open-contents]').onclick=openIndex;
  contents.querySelectorAll('[data-close-contents]').forEach(b=>b.onclick=resumeBoard);
  nav.onclick=e=>{const b=e.target.closest('[data-chapter]');if(b){chapter=b.dataset.chapter;paint()}};
  list.onclick=e=>{const b=e.target.closest('[data-destination]');if(b)route(b.dataset.destination)};
  function back(){if(!contents.hidden){resumeBoard();return true}return core.handleAndroidBack()}
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && !contents.hidden){e.stopImmediatePropagation();resumeBoard()}},true);
  window.Folio={back,resumeBoard,hostActive(value){foreground=!!value;activate()}};
  // Android supplies foreground state after the asset load. Browser previews run the same workspace.
  if(!window.InstinctaZeroNative)activate();
})();
