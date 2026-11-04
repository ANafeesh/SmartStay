import{l as e}from"./index-BBcZMl05.js";var t=e();function n({children:e,variant:n=`primary`,size:r=`md`,className:i=``,disabled:a=!1,isLoading:o=!1,...s}){let c={primary:`bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-sm shadow-blue-500/20`,secondary:`bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] shadow-sm`,outline:`border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 active:scale-[0.98]`,teal:`bg-cyan-600 text-white hover:bg-cyan-700 active:scale-[0.98] shadow-sm shadow-cyan-500/20`,danger:`bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98] shadow-sm shadow-rose-500/20`,ghost:`bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]`},l={sm:`px-3 py-1.5 text-xs rounded-xl font-medium`,md:`px-4 py-2.5 text-sm rounded-xl font-semibold`,lg:`px-6 py-3 text-base rounded-2xl font-bold`};return(0,t.jsx)(`button`,{disabled:a||o,className:`
        inline-flex items-center justify-center gap-2
        transition-all duration-150 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-blue-500/30
        ${a||o?`cursor-not-allowed opacity-50`:``}
        ${c[n]||c.primary}
        ${l[r]||l.md}
        ${i}
      `,...s,children:e})}export{n as t};