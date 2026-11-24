package com.instinctazero.folio

import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Typeface
import android.graphics.drawable.RippleDrawable
import android.view.Gravity
import android.view.View
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView

/** The index and native sheets share a flat ruled layout and a single warm accent. */
internal class FolioControls(private val context: Context) {
    companion object {
        val INK = 0xff15222a.toInt()
        val SURFACE = 0xff1c2d36.toInt()
        val RULE = 0xff3c4c53.toInt()
        val PAPER = 0xfff4eee5.toInt()
        val QUIET = 0xffb7c3c5.toInt()
        val MARK = 0xffffa47d.toInt()
    }
    private val face = Typeface.createFromAsset(context.assets,"analysis/fonts/fontawesome-webfont.ttf")
    fun dp(n:Int)=(context.resources.displayMetrics.density*n+.5f).toInt()
    fun column()=LinearLayout(context).apply { orientation=LinearLayout.VERTICAL }
    fun text(label:String,size:Float=16f,muted:Boolean=false)=TextView(context).apply {
        text=label;textSize=size;setTextColor(if(muted) QUIET else PAPER)
    }
    fun section(label:String)=text(label,22f).apply { typeface=Typeface.create("serif",Typeface.NORMAL);setPadding(0,dp(20),0,dp(9)) }
    fun row(icon:String,title:String,subtitle:String?=null,action:()->Unit):View=column().apply {
        addView(LinearLayout(context).apply {
            gravity=Gravity.CENTER_VERTICAL;minimumHeight=dp(if(subtitle==null)54 else 66)
            addView(text(icon,17f).apply { typeface=face;setTextColor(MARK);importantForAccessibility=View.IMPORTANT_FOR_ACCESSIBILITY_NO },LinearLayout.LayoutParams(dp(32),-2))
            addView(column().apply {
                addView(text(title,16f));if(subtitle!=null)addView(text(subtitle,13f,true).apply { setPadding(0,dp(3),0,0) })
            },LinearLayout.LayoutParams(0,-2,1f))
            addView(text("›",23f,true).apply { importantForAccessibility=View.IMPORTANT_FOR_ACCESSIBILITY_NO })
        })
        addView(View(context).apply { setBackgroundColor(RULE) },LinearLayout.LayoutParams(-1,dp(1)))
        background=RippleDrawable(ColorStateList.valueOf(0x33ffa47d),null,null)
        isClickable=true;isFocusable=true;contentDescription=listOfNotNull(title,subtitle).joinToString(". ")
        setOnClickListener { action() }
    }
    fun scroll(content:View)=ScrollView(context).apply { isFillViewport=true;addView(content) }
}
