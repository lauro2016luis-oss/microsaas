import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const SUPA_URL = "https://vvdhnwknluxsaxcqvlyh.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2ZGhud2tubHV4c2F4Y3F2bHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MjYwNzEsImV4cCI6MjA5MTEwMjA3MX0.8d_CdiLGv_2QwzRtIPoyyAiDUzLKfYgofacpmF4C6Jw";

const supabaseClient = createClient(SUPA_URL, SUPA_KEY);

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const C = {
  bg:"#080808", surface:"#111", surfaceHover:"#161616",
  border:"#1e1e1e", borderHover:"#2a2a2a",
  text:"#e8e8e8", textMuted:"#666", textDim:"#444",
  accent:"#7c6bff", accentDim:"rgba(124,107,255,0.12)", accentBorder:"rgba(124,107,255,0.3)",
  green:"#22c55e", greenDim:"rgba(34,197,94,0.12)",
  red:"#ef4444", redDim:"rgba(239,68,68,0.12)",
  amber:"#f59e0b", amberDim:"rgba(245,158,11,0.12)",
  blue:"#3b82f6", blueDim:"rgba(59,130,246,0.12)",
};

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');`;
const css = `
${FONT}
*{box-sizing:border-box;margin:0;padding:0;}
body,#root{background:#080808;color:#e8e8e8;font-family:'Geist',sans-serif;min-height:100vh;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:2px;}
.drag-over-col{border-color:#7c6bff!important;background:rgba(124,107,255,0.06)!important;}
.dragging-card{opacity:0.35;}
input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.5);}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.fade-in{animation:fadeIn 0.2s ease}
.sidebar{display:flex;}
.bottom-nav{display:none;}
.page-pad{padding:32px 36px;}
.grid-kpi-4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;}
.grid-pay-4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px;}
.grid-chart{display:grid;grid-template-columns:1fr 300px;gap:16px;margin-bottom:20px;}
.grid-tasks-4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;align-items:start;}
.topbar-date{display:block;}
@media(max-width:768px){
  .sidebar{display:none!important;}
  .bottom-nav{display:flex!important;position:fixed;bottom:0;left:0;right:0;background:#111;border-top:0.5px solid #1e1e1e;z-index:100;padding:8px 4px 12px;justify-content:space-around;align-items:center;}
  .page-pad{padding:20px 16px 90px!important;}
  .grid-kpi-4{grid-template-columns:repeat(2,1fr)!important;}
  .grid-pay-4{grid-template-columns:repeat(2,1fr)!important;}
  .grid-chart{grid-template-columns:1fr!important;}
  .grid-tasks-4{grid-template-columns:repeat(2,1fr)!important;}
  .topbar-date{display:none!important;}
  .main-topbar{padding:10px 16px!important;}
}
@media(max-width:480px){
  .grid-tasks-4{grid-template-columns:1fr!important;}
  .grid-kpi-4{grid-template-columns:repeat(2,1fr)!important;}
}
`;

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size=16 }) => {
  const I = {
    dashboard:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
    link:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    task:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    video:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    file:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
    folder:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
    payment:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    plus:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    search:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    x:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    chevronRight:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
    upload:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    play:<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    check:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    home:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    externalLink:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
    pdf:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    image:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    edit:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
    store:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    calendar:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    grip:<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="7" r="1.2"/><circle cx="15" cy="7" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="17" r="1.2"/><circle cx="15" cy="17" r="1.2"/></svg>,
    logout:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    eye:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeOff:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    fire:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
    zap:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    clock:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    alert:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  };
  return I[name]||null;
};

const Spinner=({size=18})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{animation:"spin 0.8s linear infinite",transformOrigin:"center",display:"inline-block"}}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

// ─── SHARED ───────────────────────────────────────────────────────────────────
const Badge=({label,color="gray"})=>{
  const S={gray:{bg:"#1a1a1a",text:"#888",border:"#2a2a2a"},green:{bg:C.greenDim,text:C.green,border:"rgba(34,197,94,0.2)"},red:{bg:C.redDim,text:C.red,border:"rgba(239,68,68,0.2)"},amber:{bg:C.amberDim,text:C.amber,border:"rgba(245,158,11,0.2)"},blue:{bg:C.blueDim,text:C.blue,border:"rgba(59,130,246,0.2)"},purple:{bg:C.accentDim,text:C.accent,border:C.accentBorder}};
  const s=S[color]||S.gray;
  return <span style={{fontSize:11,fontFamily:"'Geist Mono',monospace",padding:"2px 7px",borderRadius:4,background:s.bg,color:s.text,border:`0.5px solid ${s.border}`,whiteSpace:"nowrap"}}>{label}</span>;
};
const statusColor=s=>({Novo:"blue",Revisando:"amber",Aprovado:"green",Rejeitado:"red"}[s]||"gray");
const priorityColor=p=>({Alta:"red",Média:"amber",Baixa:"blue"}[p]||"gray");

const Btn=({children,onClick,variant="ghost",small=false,icon,loading=false,disabled=false})=>{
  const [h,setH]=useState(false);
  const base={display:"inline-flex",alignItems:"center",gap:6,cursor:disabled||loading?"not-allowed":"pointer",border:"none",outline:"none",fontFamily:"'Geist',sans-serif",fontSize:small?12:13,fontWeight:500,borderRadius:8,padding:small?"5px 10px":"8px 14px",transition:"all 0.15s",opacity:disabled?0.5:1};
  const V={ghost:{background:h?"#1a1a1a":"transparent",color:h?C.text:C.textMuted,border:`0.5px solid ${h?C.borderHover:"transparent"}`},outline:{background:h?"#161616":"transparent",color:C.text,border:`0.5px solid ${h?C.borderHover:C.border}`},primary:{background:h?"#6c5ce7":C.accent,color:"#fff",border:"none"},danger:{background:h?"#dc2626":C.redDim,color:h?"#fff":C.red,border:`0.5px solid rgba(239,68,68,0.3)`}};
  return <button style={{...base,...V[variant]}} onClick={disabled||loading?undefined:onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>{loading?<Spinner size={13}/>:icon&&<Icon name={icon} size={14}/>}{children}</button>;
};

const Input=({value,onChange,placeholder,style={},type="text",onKeyDown})=>(
  <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} onKeyDown={onKeyDown}
    style={{background:"#0d0d0d",border:`0.5px solid ${C.border}`,color:C.text,fontFamily:"'Geist',sans-serif",fontSize:13,padding:"9px 12px",borderRadius:8,outline:"none",width:"100%",...style}}
    onFocus={e=>e.target.style.borderColor=C.accentBorder} onBlur={e=>e.target.style.borderColor=C.border}/>
);

const Modal=({title,onClose,children})=>(
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:24}} onClick={onClose}>
    <div className="fade-in" style={{background:"#111",border:`0.5px solid ${C.border}`,borderRadius:16,padding:24,maxWidth:520,width:"100%",maxHeight:"85vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h3 style={{fontSize:16,fontWeight:500,color:C.text}}>{title}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",padding:4}}><Icon name="x"/></button>
      </div>
      {children}
    </div>
  </div>
);

const Toast=({msg,type="success",onDone})=>{
  useEffect(()=>{const t=setTimeout(onDone,2500);return()=>clearTimeout(t);},[]);
  const S={success:{bg:C.greenDim,color:C.green,border:"rgba(34,197,94,0.3)"},error:{bg:C.redDim,color:C.red,border:"rgba(239,68,68,0.3)"},info:{bg:C.accentDim,color:C.accent,border:C.accentBorder}};
  const s=S[type]||S.info;
  return <div className="fade-in" style={{position:"fixed",bottom:24,right:24,zIndex:2000,padding:"10px 16px",borderRadius:10,background:s.bg,color:s.color,border:`0.5px solid ${s.border}`,fontSize:13,fontWeight:500}}>{msg}</div>;
};
const useToast=()=>{
  const [t,setT]=useState(null);
  const show=(msg,type="success")=>setT({msg,type,id:Date.now()});
  const El=t?<Toast key={t.id} msg={t.msg} type={t.type} onDone={()=>setT(null)}/>:null;
  return {show,El};
};

// ─── HOOKS ────────────────────────────────────────────────────────────────────
const useIsMobile=()=>{
  const [mobile,setMobile]=useState(()=>window.innerWidth<=768);
  useEffect(()=>{
    const fn=()=>setMobile(window.innerWidth<=768);
    window.addEventListener("resize",fn);
    return()=>window.removeEventListener("resize",fn);
  },[]);
  return mobile;
};

// ─── BOTTOM NAV (mobile) ──────────────────────────────────────────────────────
const BottomNav=({page,setPage,sb})=>{
  const nav=[
    {id:"dashboard",icon:"dashboard",label:"Painel"},
    {id:"tarefas",icon:"task",label:"Tarefas"},
    {id:"links",icon:"link",label:"Links"},
    {id:"payments",icon:"payment",label:"Payments"},
    {id:"lojas",icon:"store",label:"Lojas"},
    {id:"arquivos",icon:"file",label:"Arquivos"},
  ];
  return(
    <div className="bottom-nav">
      {nav.map(n=>{
        const active=page===n.id;
        return(
          <button key={n.id} onClick={()=>setPage(n.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"4px 8px",borderRadius:8,color:active?C.accent:C.textMuted,transition:"color 0.15s",minWidth:40}}>
            <Icon name={n.icon} size={20}/>
            <span style={{fontSize:9,fontFamily:"'Geist',sans-serif",fontWeight:active?600:400}}>{n.label}</span>
          </button>
        );
      })}
      <button onClick={()=>sb.auth.signOut()} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"4px 8px",borderRadius:8,color:C.textDim,minWidth:40}}>
        <Icon name="logout" size={20}/>
        <span style={{fontSize:9,fontFamily:"'Geist',sans-serif"}}>Sair</span>
      </button>
    </div>
  );
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
const LoginPage=({sb})=>{
  const [mode,setMode]=useState("login"); // "login" | "signup" | "reset"
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [showPw,setShowPw]=useState(false);
  const [loading,setLoading]=useState(false);
  const [msg,setMsg]=useState(null); // {text, type}
  const {show,El}=useToast();

  const handle=async()=>{
    if(!email.trim()){setMsg({text:"Informe o e-mail.",type:"error"});return;}
    setLoading(true);setMsg(null);
    if(mode==="reset"){
      const{error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin});
      if(error){setMsg({text:error.message,type:"error"});}
      else{setMsg({text:"Enviamos um link de redefinição para o seu e-mail.",type:"success"});}
      setLoading(false);return;
    }
    if(!password){setMsg({text:"Informe a senha.",type:"error"});setLoading(false);return;}
    const fn=mode==="signup"
      ?sb.auth.signUp({email:email.trim(),password})
      :sb.auth.signInWithPassword({email:email.trim(),password});
    const{error}=await fn;
    if(error){setMsg({text:error.message,type:"error"});}
    else if(mode==="signup"){setMsg({text:"Conta criada! Verifique seu e-mail para confirmar.",type:"success"});}
    setLoading(false);
  };

  const titles={login:"Entrar",signup:"Criar conta",reset:"Redefinir senha"};
  const btnLabels={login:"Entrar",signup:"Criar conta",reset:"Enviar link"};

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg,padding:24}}>
      {El}
      <style>{css}</style>
      <div className="fade-in" style={{width:"100%",maxWidth:380}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:44,height:44,borderRadius:12,background:C.accentDim,border:`0.5px solid ${C.accentBorder}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",color:C.accent}}>
            <Icon name="zap" size={20}/>
          </div>
          <h1 style={{fontSize:22,fontWeight:600,color:C.text,letterSpacing:"-0.03em"}}>Workspace</h1>
          <p style={{fontSize:13,color:C.textMuted,marginTop:4}}>{titles[mode]}</p>
        </div>

        {/* Card */}
        <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:16,padding:28}}>
          {msg&&(
            <div style={{marginBottom:16,padding:"10px 14px",borderRadius:9,background:msg.type==="error"?C.redDim:C.greenDim,color:msg.type==="error"?C.red:C.green,border:`0.5px solid ${msg.type==="error"?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}`,fontSize:13}}>
              {msg.text}
            </div>
          )}

          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>E-mail</label>
              <Input value={email} onChange={setEmail} placeholder="seu@email.com" type="email" onKeyDown={e=>e.key==="Enter"&&handle()}/>
            </div>

            {mode!=="reset"&&(
              <div>
                <label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Senha</label>
                <div style={{position:"relative"}}>
                  <Input value={password} onChange={setPassword} placeholder={mode==="signup"?"Mínimo 6 caracteres":"Sua senha"} type={showPw?"text":"password"} onKeyDown={e=>e.key==="Enter"&&handle()}/>
                  <button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.textMuted,cursor:"pointer",padding:4}}>
                    <Icon name={showPw?"eyeOff":"eye"} size={14}/>
                  </button>
                </div>
              </div>
            )}

            <button onClick={handle} disabled={loading} style={{width:"100%",padding:"10px",borderRadius:9,background:loading?"#333":C.accent,color:"#fff",border:"none",fontSize:14,fontWeight:500,cursor:loading?"not-allowed":"pointer",fontFamily:"'Geist',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"background 0.15s"}}
              onMouseEnter={e=>{if(!loading)e.currentTarget.style.background="#6c5ce7";}}
              onMouseLeave={e=>{if(!loading)e.currentTarget.style.background=C.accent;}}>
              {loading?<Spinner size={14}/>:null}{btnLabels[mode]}
            </button>
          </div>
        </div>

        {/* Links */}
        <div style={{textAlign:"center",marginTop:18,display:"flex",flexDirection:"column",gap:8}}>
          {mode==="login"&&(
            <>
              <button onClick={()=>{setMode("signup");setMsg(null);}} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:13,fontFamily:"'Geist',sans-serif"}}>
                Não tem conta? <span style={{color:C.accent}}>Criar conta</span>
              </button>
              <button onClick={()=>{setMode("reset");setMsg(null);}} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",fontSize:12,fontFamily:"'Geist',sans-serif"}}>
                Esqueci minha senha
              </button>
            </>
          )}
          {mode==="signup"&&(
            <button onClick={()=>{setMode("login");setMsg(null);}} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:13,fontFamily:"'Geist',sans-serif"}}>
              Já tem conta? <span style={{color:C.accent}}>Entrar</span>
            </button>
          )}
          {mode==="reset"&&(
            <button onClick={()=>{setMode("login");setMsg(null);}} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:13,fontFamily:"'Geist',sans-serif"}}>
              ← Voltar para o login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar=({page,setPage,storeName,setStoreName,sb,user})=>{
  const [editing,setEditing]=useState(false);
  const [inp,setInp]=useState(storeName);
  const nav=[
    {id:"dashboard",label:"Painel",icon:"dashboard"},
    {id:"links",label:"Links",icon:"link"},
    {id:"tarefas",label:"Tarefas",icon:"task"},
    {id:"arquivos",label:"Arquivos",icon:"file"},
    {id:"payments",label:"Payments",icon:"payment"},
    {id:"lojas",label:"Lojas",icon:"store"},
  ];
  const save=()=>{if(inp.trim())setStoreName(inp.trim());setEditing(false);};
  return (
    <div style={{width:220,minWidth:220,background:C.surface,borderRight:`0.5px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"20px 12px"}}>
      <div style={{padding:"4px 12px",marginBottom:28}}>
        <div style={{fontSize:15,fontWeight:600,color:C.text,letterSpacing:"-0.02em"}}>workspace</div>
        <div style={{fontSize:11,color:C.textMuted,fontFamily:"'Geist Mono',monospace",marginTop:2}}>espaço pessoal</div>
      </div>
      <nav style={{display:"flex",flexDirection:"column",gap:2}}>
        {nav.map(n=>{
          const active=page===n.id;
          return <button key={n.id} onClick={()=>setPage(n.id)}
            style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,background:active?C.accentDim:"transparent",color:active?C.accent:C.textMuted,border:`0.5px solid ${active?C.accentBorder:"transparent"}`,cursor:"pointer",fontSize:13,fontFamily:"'Geist',sans-serif",fontWeight:active?500:400,transition:"all 0.15s",textAlign:"left"}}
            onMouseEnter={e=>{if(!active){e.currentTarget.style.background="#161616";e.currentTarget.style.color=C.text;}}}
            onMouseLeave={e=>{if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.textMuted;}}}
          ><Icon name={n.icon} size={15}/>{n.label}</button>;
        })}
      </nav>
      <div style={{marginTop:20,padding:"12px",borderRadius:10,background:"#0d0d0d",border:`0.5px solid ${C.border}`}}>
        <div style={{fontSize:10,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>Link da loja</div>
        {editing?(
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <input autoFocus value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&save()} style={{background:"#1a1a1a",border:`0.5px solid ${C.accentBorder}`,color:C.text,fontFamily:"'Geist',sans-serif",fontSize:12,padding:"6px 8px",borderRadius:6,outline:"none",width:"100%"}}/>
            <div style={{display:"flex",gap:4}}>
              <button onClick={save} style={{flex:1,background:C.accentDim,border:`0.5px solid ${C.accentBorder}`,color:C.accent,fontSize:11,borderRadius:5,padding:"4px 0",cursor:"pointer",fontFamily:"'Geist',sans-serif"}}>Salvar</button>
              <button onClick={()=>setEditing(false)} style={{flex:1,background:"#1a1a1a",border:`0.5px solid ${C.border}`,color:C.textMuted,fontSize:11,borderRadius:5,padding:"4px 0",cursor:"pointer",fontFamily:"'Geist',sans-serif"}}>Cancelar</button>
            </div>
          </div>
        ):(
          <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>{setInp(storeName);setEditing(true);}}>
            <div style={{width:28,height:28,borderRadius:7,background:C.amberDim,display:"flex",alignItems:"center",justifyContent:"center",color:C.amber,flexShrink:0}}><Icon name="store" size={14}/></div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:500,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{storeName}</div>
              <div style={{fontSize:10,color:C.textMuted}}>clique para editar</div>
            </div>
          </div>
        )}
      </div>
      <div style={{marginTop:"auto",padding:"10px 12px",borderRadius:10,background:"#0d0d0d",border:`0.5px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:C.green,flexShrink:0}}/>
        <div style={{flex:1,fontSize:11,color:C.textMuted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.email||"conectado"}</div>
        <button onClick={()=>sb.auth.signOut()} title="Sair" style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",padding:2,display:"flex",alignItems:"center"}}><Icon name="logout" size={14}/></button>
      </div>
    </div>
  );
};

// ─── LINE CHART COM CHART.JS ──────────────────────────────────────────────────
const LineChart=({data})=>{
  const canvasRef=useRef(null);
  const chartRef=useRef(null);

  useEffect(()=>{
    if(!canvasRef.current)return;
    if(chartRef.current){chartRef.current.destroy();chartRef.current=null;}
    if(!data||data.length===0)return;

    const ctx=canvasRef.current.getContext("2d");
    const labels=data.map(d=>{
      const [y,m,dd]=(d.date||"").split("-");
      return `${dd}/${m}`;
    });
    const values=data.map(d=>d.profit||0);
    const hasNeg=values.some(v=>v<0);

    const gradient=ctx.createLinearGradient(0,0,0,200);
    gradient.addColorStop(0,"rgba(34,197,94,0.25)");
    gradient.addColorStop(1,"rgba(34,197,94,0)");

    chartRef.current=new window.Chart(ctx,{
      type:"line",
      data:{
        labels,
        datasets:[{
          label:"Lucro",
          data:values,
          borderColor:"#22c55e",
          borderWidth:2,
          backgroundColor:gradient,
          fill:true,
          tension:0.4,
          pointBackgroundColor:"#22c55e",
          pointBorderColor:"#080808",
          pointBorderWidth:2,
          pointRadius:4,
          pointHoverRadius:6,
        }]
      },
      options:{
        responsive:true,
        maintainAspectRatio:false,
        interaction:{mode:"index",intersect:false},
        plugins:{
          legend:{display:false},
          tooltip:{
            backgroundColor:"#1a1a1a",
            borderColor:"#2a2a2a",
            borderWidth:1,
            titleColor:"#888",
            bodyColor:"#e8e8e8",
            padding:10,
            callbacks:{
              label:(ctx)=>`Lucro: R$ ${ctx.parsed.y.toLocaleString("pt-BR",{minimumFractionDigits:2})}`
            }
          }
        },
        scales:{
          x:{
            grid:{color:"rgba(255,255,255,0.04)"},
            ticks:{color:"#555",font:{size:11},maxRotation:0},
            border:{color:"transparent"}
          },
          y:{
            grid:{color:"rgba(255,255,255,0.04)"},
            ticks:{
              color:"#555",font:{size:11},
              callback:(v)=>`R$ ${v>=1000?Math.round(v/1000)+"k":v}`
            },
            border:{color:"transparent"}
          }
        }
      }
    });
  },[data]);

  useEffect(()=>()=>{if(chartRef.current){chartRef.current.destroy();}}, []);

  if(!data||data.length===0) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:8}}>
      <div style={{color:C.textDim,fontSize:13}}>Nenhum dado ainda</div>
      <div style={{fontSize:11,color:C.textDim}}>Registre seu primeiro resultado para ver o gráfico</div>
    </div>
  );

  return <canvas ref={canvasRef} style={{width:"100%",height:"100%"}}/>;
};

// ─── PAINEL ───────────────────────────────────────────────────────────────────
const SUPA_FUNCTIONS_URL="https://vvdhnwknluxsaxcqvlyh.supabase.co/functions/v1";

const PainelPage=({sb,user,setPage})=>{
  const [tasks,setTasks]=useState([]);
  const [links,setLinks]=useState([]);
  const [payments,setPayments]=useState([]);
  const [profits,setProfits]=useState([]);
  const [lojasCad,setLojasCad]=useState([]);
  const [loading,setLoading]=useState(true);
  const [chartReady,setChartReady]=useState(false);
  const [modalResultado,setModalResultado]=useState(false);
  const [editProfit,setEditProfit]=useState(null);
  const [saving,setSaving]=useState(false);
  const [filtroLoja,setFiltroLoja]=useState("Todas");
  const [filtroPeriodo,setFiltroPeriodo]=useState("total");
  const [filtroMoeda,setFiltroMoeda]=useState("BRL");
  const [filtroDataInicio,setFiltroDataInicio]=useState("");
  const [filtroDataFim,setFiltroDataFim]=useState("");
  const hoje=new Date().toISOString().slice(0,10);
  const [form,setForm]=useState({store_name:"",date:hoje,currency:"BRL",revenue:"",ad_spend:""});
  // Shopify
  const [shopifyConfigs,setShopifyConfigs]=useState([]);
  const [shopifyLoading,setShopifyLoading]=useState(false);
  const [syncingId,setSyncingId]=useState(null);
  const [showShopifySettings,setShowShopifySettings]=useState(false);
  const [manualDomain,setManualDomain]=useState("");
  const [manualToken,setManualToken]=useState("");
  const [manualSaving,setManualSaving]=useState(false);
  // Google Ads
  const [googleAdsConfigs,setGoogleAdsConfigs]=useState([]);
  const [showGadsSettings,setShowGadsSettings]=useState(false);
  const [gadsSaving,setGadsSaving]=useState(false);
  const [gadsSyncing,setGadsSyncing]=useState(false);
  const [gadsForm,setGadsForm]=useState({clientId:"",clientSecret:"",developerToken:"",customerId:"",accountName:""});
  const {show,El}=useToast();

  // Detecta retorno de OAuth
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    if(params.get("shopify_connected")==="1"){
      show("Shopify conectado! Sincronizando... 🎉");
      window.history.replaceState({},"",window.location.pathname);
      loadShopifyConfigs();
      setTimeout(()=>syncShopify(null),1500);
    }
    if(params.get("shopify_error")){show("Erro Shopify: "+params.get("shopify_error"),"error");window.history.replaceState({},"",window.location.pathname);}
    if(params.get("gads_connected")==="1"){
      show("Google Ads conectado! Sincronizando... 🎉");
      window.history.replaceState({},"",window.location.pathname);
      loadGoogleAdsConfigs();
      setTimeout(()=>syncGoogleAds(),1500);
    }
    if(params.get("gads_error")){show("Erro Google Ads: "+params.get("gads_error"),"error");window.history.replaceState({},"",window.location.pathname);}
  },[]);

  const loadShopifyConfigs=async()=>{
    const{data}=await sb.from("shopify_configs").select("*").eq("user_id",user.id).order("connected_at");
    setShopifyConfigs(data||[]);
  };

  const loadGoogleAdsConfigs=async()=>{
    const{data}=await sb.from("google_ads_configs").select("*").eq("user_id",user.id).order("connected_at");
    setGoogleAdsConfigs(data||[]);
  };

  const syncShopify=async(shopDomain)=>{
    setSyncingId(shopDomain||"all");
    try{
      const{data:{session}}=await sb.auth.getSession();
      const body=shopDomain?JSON.stringify({shop_domain:shopDomain}):"{}";
      const res=await fetch(`${SUPA_FUNCTIONS_URL}/shopify-sync`,{method:"POST",headers:{Authorization:`Bearer ${session.access_token}`,"Content-Type":"application/json"},body});
      const data=await res.json();
      if(data.error){show("Erro: "+data.error,"error");}
      else{
        const errs=data.errors?.length?" ("+data.errors.join(", ")+")":"";
        show(data.orders_synced+" pedidos importados · "+data.days_synced+" dias"+errs);
        await loadAll();await loadShopifyConfigs();
      }
    }catch(e){show("Erro de rede: "+String(e),"error");}
    setSyncingId(null);
  };

  const syncGoogleAds=async()=>{
    setGadsSyncing(true);
    try{
      const{data:{session}}=await sb.auth.getSession();
      const res=await fetch(`${SUPA_FUNCTIONS_URL}/google-ads-sync`,{method:"POST",headers:{Authorization:`Bearer ${session.access_token}`}});
      const data=await res.json();
      if(data.error){show("Erro Google Ads: "+data.error,"error");}
      else{
        const errs=data.errors?.length?" | "+data.errors.join("; "):"";
        show("Google Ads: "+data.days_synced+" dias sincronizados"+errs);
        await loadAll();await loadGoogleAdsConfigs();
      }
    }catch(e){show("Erro: "+String(e),"error");}
    setGadsSyncing(false);
  };

  const saveShopifyManual=async()=>{
    if(!manualDomain.trim()||!manualToken.trim()){show("Preencha domínio e token","error");return;}
    setManualSaving(true);
    const domain=manualDomain.trim().replace(/^https?:\/\//,"").replace(/\/$/,"");
    const{error}=await sb.from("shopify_configs").upsert({
      user_id:user.id,shop_domain:domain,access_token:manualToken.trim(),
    },{onConflict:"user_id,shop_domain"});
    if(error){show("Erro: "+error.message,"error");}
    else{
      show("Loja salva! ✅ Sincronizando...");
      setShowShopifySettings(false);setManualDomain("");setManualToken("");
      await loadShopifyConfigs();
      setTimeout(()=>syncShopify(domain),800);
    }
    setManualSaving(false);
  };

  const disconnectShopify=async(id)=>{
    if(!window.confirm("Remover esta loja? Os dados importados serão mantidos."))return;
    await sb.from("shopify_configs").delete().eq("id",id);
    setShopifyConfigs(p=>p.filter(c=>c.id!==id));
    show("Loja removida");
  };

  const connectGoogleAds=async()=>{
    if(!gadsForm.clientId||!gadsForm.clientSecret||!gadsForm.developerToken||!gadsForm.customerId){
      show("Preencha todos os campos obrigatórios","error");return;
    }
    setGadsSaving(true);
    const{data:{session}}=await sb.auth.getSession();
    const res=await fetch(`${SUPA_FUNCTIONS_URL}/google-ads-oauth`,{
      method:"POST",
      headers:{Authorization:`Bearer ${session.access_token}`,"Content-Type":"application/json"},
      body:JSON.stringify(gadsForm),
    });
    const{url,error}=await res.json();
    if(error){show("Erro: "+error,"error");setGadsSaving(false);return;}
    window.location.href=url;
  };

  const disconnectGoogleAds=async(id)=>{
    if(!window.confirm("Remover esta conta Google Ads? Dados importados serão mantidos."))return;
    await sb.from("google_ads_configs").delete().eq("id",id);
    setGoogleAdsConfigs(p=>p.filter(c=>c.id!==id));
    show("Conta removida");
  };

  // Carrega Chart.js uma vez
  useEffect(()=>{
    if(window.Chart){setChartReady(true);return;}
    const s=document.createElement("script");
    s.src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js";
    s.onload=()=>setChartReady(true);
    document.head.appendChild(s);
  },[]);

  useEffect(()=>{loadAll();loadShopifyConfigs();loadGoogleAdsConfigs();},[]);

  const loadAll=async()=>{
    const[l,t,p,pr,lj]=await Promise.all([
      sb.from("links").select("*").eq("user_id",user.id).order("created_at",{ascending:false}).limit(4),
      sb.from("tarefas").select("*").eq("user_id",user.id),
      sb.from("payments").select("*").eq("user_id",user.id),
      sb.from("store_profits").select("*").eq("user_id",user.id).order("date",{ascending:true}),
      sb.from("lojas").select("*").eq("user_id",user.id).order("nome",{ascending:true}),
    ]);
    setLinks(l.data||[]);
    setTasks(t.data||[]);
    setPayments(p.data||[]);
    setProfits(pr.data||[]);
    setLojasCad(lj.data||[]);
    setLoading(false);
  };

  // Carrega só profits sem resetar loading
  const reloadProfits=async()=>{
    const{data}=await sb.from("store_profits").select("*").eq("user_id",user.id).order("date",{ascending:true});
    setProfits(data||[]);
  };

  const [taxas,setTaxas]=useState({"BRL":1,"USD":0.18,"EUR":0.165,"GBP":0.14});
  const [taxaInfo,setTaxaInfo]=useState({atualizado:null,carregando:true});

  useEffect(()=>{
    const buscarTaxas=async()=>{
      // Tenta API principal, se falhar tenta fallback
      const urls=[
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/brl.json",
        "https://latest.currency-api.pages.dev/v1/currencies/brl.json",
      ];
      for(const url of urls){
        try{
          const r=await fetch(url);
          const data=await r.json();
          const rates=data?.brl||{};
          if(rates.usd&&rates.eur&&rates.gbp){
            setTaxas({BRL:1,USD:rates.usd,EUR:rates.eur,GBP:rates.gbp});
            setTaxaInfo({atualizado:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),carregando:false});
            return;
          }
        }catch(e){continue;}
      }
      // Ambas falharam — usa taxas aproximadas
      setTaxaInfo({atualizado:"offline",carregando:false});
    };
    buscarTaxas();
  },[]);

  const ontem=new Date(Date.now()-86400000).toISOString().slice(0,10);

  // Converte qualquer moeda para a moeda de visualização selecionada via BRL como base
  const converter=(valor,moedaOrigem)=>{
    if(!valor)return 0;
    // Converte para BRL primeiro, depois para moeda destino
    const emBRL=moedaOrigem==="BRL"?(valor||0):(valor||0)/(taxas[moedaOrigem]||1);
    if(filtroMoeda==="BRL")return emBRL;
    return emBRL*(taxas[filtroMoeda]||1);
  };

  const filterByPeriod=(rows)=>{
    return rows.filter(r=>{
      const d=r.date?.slice(0,10);
      if(filtroPeriodo==="hoje") return d===hoje;
      if(filtroPeriodo==="ontem") return d===ontem;
      if(filtroPeriodo==="7dias"){const cutoff=new Date(Date.now()-7*86400000).toISOString().slice(0,10);return d>=cutoff;}
      if(filtroPeriodo==="30dias"){const cutoff=new Date(Date.now()-30*86400000).toISOString().slice(0,10);return d>=cutoff;}
      if(filtroPeriodo==="custom"){
        if(filtroDataInicio&&filtroDataFim) return d>=filtroDataInicio&&d<=filtroDataFim;
        if(filtroDataInicio) return d>=filtroDataInicio;
        return true;
      }
      return true;
    });
  };

  // Sem filtro de moeda — mostra TODOS os registros convertidos
  const filtrados=profits.filter(r=>filtroLoja==="Todas"||r.store_name===filtroLoja);
  const filtradosPeriodo=filterByPeriod(filtrados);

  // KPIs respondem ao período selecionado
  const kpiLucro=filtradosPeriodo.reduce((a,r)=>a+converter(r.profit,r.currency),0);
  const kpiFat=filtradosPeriodo.reduce((a,r)=>a+converter(r.revenue,r.currency),0);
  const kpiAds=filtradosPeriodo.reduce((a,r)=>a+converter(r.ad_spend,r.currency),0);
  const lucroTotal=filtrados.reduce((a,r)=>a+converter(r.profit,r.currency),0);
  const periodoLabel={
    total:"Total",hoje:"Hoje",ontem:"Ontem",
    "7dias":"7 Dias","30dias":"30 Dias",
    custom:(filtroDataInicio&&filtroDataFim)?`${filtroDataInicio.slice(5).replace("-","/")} → ${filtroDataFim.slice(5).replace("-","/")}`:filtroDataInicio?`desde ${filtroDataInicio.slice(5).replace("-","/")}` :"Período",
  }[filtroPeriodo]||"";

  const simbolo={"BRL":"R$","USD":"US$","EUR":"€","GBP":"£"}[filtroMoeda]||"R$";
  const fmtVal=(v)=>`${v<0?"-":""}${simbolo} ${Math.abs(v).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}`;

  const lucroPorLoja=[...new Set(filtradosPeriodo.map(r=>r.store_name))].map(loja=>{
    const rows=filtradosPeriodo.filter(r=>r.store_name===loja);
    return{loja,lucro:rows.reduce((a,r)=>a+converter(r.profit,r.currency),0)};
  }).sort((a,b)=>b.lucro-a.lucro);

  // Gráfico — agrupa por dia usando filtrados (loja + moeda, sem filtro de período para ver histórico)
  const graficoDados=Object.values(
    filtrados.reduce((acc,r)=>{
      const d=r.date?.slice(0,10)||"";
      if(!acc[d]) acc[d]={date:d,profit:0};
      acc[d].profit+=converter(r.profit,r.currency);
      return acc;
    },{})
  ).sort((a,b)=>a.date.localeCompare(b.date)).slice(-30);

  const recentes=[...filtradosPeriodo].sort((a,b)=>(b.date||"").localeCompare(a.date||"")).slice(0,8);

  const openEditProfit=(r)=>{
    setEditProfit(r);
    setForm({
      store_name:r.store_name,
      date:r.date?.slice(0,10)||hoje,
      currency:r.currency||"BRL",
      revenue:String(r.revenue||""),
      ad_spend:String(r.ad_spend||""),
    });
    setModalResultado(true);
  };

  const closeModal=()=>{
    setModalResultado(false);
    setEditProfit(null);
    setForm({store_name:"",date:hoje,currency:"BRL",revenue:"",ad_spend:""});
  };

  const registrar=async()=>{
    if(!form.store_name.trim()||!form.revenue){show("Preencha loja e faturamento","error");return;}
    setSaving(true);
    const rev=parseFloat(form.revenue.replace(",","."))||0;
    const ads=parseFloat((form.ad_spend||"0").replace(",","."))||0;
    if(editProfit){
      // Editar existente
      const{error}=await sb.from("store_profits").update({
        store_name:form.store_name.trim(),
        date:form.date,
        currency:form.currency,
        revenue:rev,
        ad_spend:ads,
      }).eq("id",editProfit.id);
      if(error){show("Erro ao atualizar: "+error.message,"error");}
      else{show("Resultado atualizado! ✅");closeModal();await reloadProfits();}
    } else {
      // Novo registro
      const{error}=await sb.from("store_profits").insert({
        user_id:user.id,
        store_name:form.store_name.trim(),
        date:form.date,
        currency:form.currency,
        revenue:rev,
        ad_spend:ads,
      });
      if(error){show("Erro ao salvar: "+error.message,"error");}
      else{show("Resultado registrado! ✅");closeModal();await reloadProfits();}
    }
    setSaving(false);
  };

  const deleteProfit=async(id)=>{
    const{error}=await sb.from("store_profits").delete().eq("id",id);
    if(error){show("Erro ao excluir","error");}
    else{show("Resultado excluído");await reloadProfits();}
  };

  const hojeList=tasks.filter(t=>t.status==="Hoje");
  const atrasadas=tasks.filter(t=>t.status==="Atrasado");

  if(loading)return <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}><Spinner size={28}/></div>;

  const periodos=[
    {id:"total",label:"Total"},
    {id:"hoje",label:"Hoje"},
    {id:"ontem",label:"Ontem"},
    {id:"7dias",label:"7 dias"},
    {id:"30dias",label:"30 dias"},
    {id:"custom",label:"📅 Período"},
  ];
  const moedas=["BRL","USD","EUR","GBP"];

  return (
    <div className="page-pad" style={{overflowY:"auto",flex:1}}>
      {El}

      {/* HEADER */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28}}>
        <div><h1 style={{fontSize:24,fontWeight:600,color:C.text,letterSpacing:"-0.03em"}}>Bom dia 👋</h1><p style={{fontSize:14,color:C.textMuted,marginTop:4}}>Seu espaço de trabalho.</p></div>
        <button onClick={()=>setModalResultado(true)} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 16px",borderRadius:9,background:C.accent,color:"#fff",border:"none",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'Geist',sans-serif"}}
          onMouseEnter={e=>e.currentTarget.style.background="#6c5ce7"} onMouseLeave={e=>e.currentTarget.style.background=C.accent}>
          <Icon name="plus" size={14}/> Registrar
        </button>
      </div>

      {/* INTEGRAÇÕES */}
      <div style={{marginBottom:20,background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
        {/* Header */}
        <div style={{padding:"12px 18px",borderBottom:`0.5px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <span style={{fontSize:13,fontWeight:500,color:C.text}}>Integrações</span>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {(shopifyConfigs.length>0||googleAdsConfigs.length>0)&&(
              <Btn variant="outline" small onClick={()=>{syncShopify(null);if(googleAdsConfigs.length>0)syncGoogleAds();}} loading={syncingId==="all"} icon="zap">Sincronizar tudo</Btn>
            )}
            <Btn variant="primary" small onClick={()=>{setManualDomain("");setManualToken("");setShowShopifySettings(true);}} icon="plus">+ Shopify</Btn>
            <Btn variant="outline" small onClick={()=>{setGadsForm({clientId:"",clientSecret:"",developerToken:"",customerId:"",accountName:""});setShowGadsSettings(true);}} icon="plus">+ Google Ads</Btn>
          </div>
        </div>

        {/* Lista Shopify */}
        {shopifyConfigs.map(cfg=>(
          <div key={cfg.id} style={{padding:"12px 18px",borderBottom:`0.5px solid ${C.border}`,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <div style={{width:32,height:32,borderRadius:8,background:"rgba(34,197,94,0.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15.5 3.5C15.5 3.5 15 3 13.5 3C12 3 11 4.5 10.5 5.5L6 6.5L4 20H18L20 6.5L16.5 5.5C16.5 5.5 16.5 3.5 15.5 3.5Z" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.5 5.5C10.5 5.5 11 9 14 9C17 9 16.5 5.5 16.5 5.5" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:500,color:C.text}}>Shopify · <span style={{color:C.green}}>● {cfg.shop_domain}</span></div>
              <div style={{fontSize:11,color:C.textMuted,marginTop:1}}>última sync: {cfg.last_sync_at?new Date(cfg.last_sync_at).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"nunca"}</div>
            </div>
            <Btn variant="outline" small onClick={()=>syncShopify(cfg.shop_domain)} loading={syncingId===cfg.shop_domain} icon="zap">Sync</Btn>
            <Btn variant="ghost" small onClick={()=>{setManualDomain(cfg.shop_domain);setManualToken("");setShowShopifySettings(true);}} icon="edit"/>
            <Btn variant="ghost" small onClick={()=>disconnectShopify(cfg.id)} icon="x"/>
          </div>
        ))}

        {/* Lista Google Ads */}
        {googleAdsConfigs.map(cfg=>(
          <div key={cfg.id} style={{padding:"12px 18px",borderBottom:`0.5px solid ${C.border}`,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <div style={{width:32,height:32,borderRadius:8,background:"rgba(59,130,246,0.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12,fontWeight:700,color:C.blue}}>G</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:500,color:C.text}}>Google Ads · <span style={{color:C.blue}}>● {cfg.account_name||cfg.customer_id}</span></div>
              <div style={{fontSize:11,color:C.textMuted,marginTop:1}}>ID: {cfg.customer_id} · última sync: {cfg.last_sync_at?new Date(cfg.last_sync_at).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"nunca"}</div>
            </div>
            <Btn variant="outline" small onClick={syncGoogleAds} loading={gadsSyncing} icon="zap">Sync</Btn>
            <Btn variant="ghost" small onClick={()=>disconnectGoogleAds(cfg.id)} icon="x"/>
          </div>
        ))}

        {/* Adicionar */}
        <div style={{padding:"10px 18px",display:"flex",gap:8,flexWrap:"wrap"}}>
          <Btn variant="ghost" small onClick={()=>{setManualDomain("");setManualToken("");setShowShopifySettings(true);}} icon="plus">Adicionar Shopify</Btn>
          <Btn variant="ghost" small onClick={()=>{setGadsForm({clientId:"",clientSecret:"",developerToken:"",customerId:"",accountName:""});setShowGadsSettings(true);}} icon="plus">Adicionar Google Ads</Btn>
        </div>
      </div>

      {/* MODAL SHOPIFY */}
      {showShopifySettings&&(
        <Modal title={manualDomain?"Editar Loja Shopify":"Adicionar Loja Shopify"} onClose={()=>setShowShopifySettings(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{padding:"10px 14px",background:"rgba(124,107,255,0.08)",borderRadius:9,border:`0.5px solid ${C.accentBorder}`,fontSize:12,color:C.textMuted,lineHeight:"1.6"}}>
              Precisa do <strong style={{color:C.text}}>Admin API Access Token</strong> da sua loja.<br/>
              Shopify Admin → <strong style={{color:C.accent}}>Configurações → Apps → Desenvolver apps</strong> → crie um app → instale → copie o token.
            </div>
            <div>
              <label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Domínio da loja</label>
              <Input value={manualDomain} onChange={setManualDomain} placeholder="minhaloja.myshopify.com"/>
            </div>
            <div>
              <label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Admin API Access Token</label>
              <Input value={manualToken} onChange={setManualToken} placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" type="password"/>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn variant="outline" onClick={()=>setShowShopifySettings(false)}>Cancelar</Btn>
              <Btn variant="primary" onClick={saveShopifyManual} loading={manualSaving} icon="zap">Salvar e Sincronizar</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL GOOGLE ADS */}
      {showGadsSettings&&(
        <Modal title="Conectar Google Ads" onClose={()=>setShowGadsSettings(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{padding:"10px 14px",background:"rgba(59,130,246,0.08)",borderRadius:9,border:"0.5px solid rgba(59,130,246,0.3)",fontSize:12,color:C.textMuted,lineHeight:"1.7"}}>
              <strong style={{color:C.text}}>O que você precisa:</strong><br/>
              1. <strong style={{color:C.blue}}>Customer ID</strong> — número da sua conta Google Ads (ex: 123-456-7890)<br/>
              2. <strong style={{color:C.blue}}>Client ID + Secret</strong> — crie em <strong>console.cloud.google.com</strong> → APIs → Credenciais → OAuth<br/>
              3. <strong style={{color:C.blue}}>Developer Token</strong> — no Google Ads: Ferramentas → API Google Ads → Centro de API<br/>
              4. Após preencher, clique Conectar e autorize no Google.
            </div>
            {[
              {label:"Customer ID",key:"customerId",ph:"123-456-7890"},
              {label:"Nome da conta (opcional)",key:"accountName",ph:"Minha Loja Ads"},
              {label:"Client ID (Google Cloud)",key:"clientId",ph:"xxxxxx.apps.googleusercontent.com"},
              {label:"Client Secret",key:"clientSecret",ph:"GOCSPX-xxxxxxx",type:"password"},
              {label:"Developer Token",key:"developerToken",ph:"xxxxxxxxxxxxxxxx",type:"password"},
            ].map(f=>(
              <div key={f.key}>
                <label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:5}}>{f.label}{!f.label.includes("opcional")&&<span style={{color:C.red}}> *</span>}</label>
                <Input value={gadsForm[f.key]} onChange={v=>setGadsForm(p=>({...p,[f.key]:v}))} placeholder={f.ph} type={f.type||"text"}/>
              </div>
            ))}
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:4}}>
              <Btn variant="outline" onClick={()=>setShowGadsSettings(false)}>Cancelar</Btn>
              <Btn variant="primary" onClick={connectGoogleAds} loading={gadsSaving} icon="zap">Conectar com Google</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* KPI CARDS */}
      <div className="grid-kpi-4">
        {[
          {l:`💰 Lucro · ${periodoLabel}`,v:kpiLucro,c:kpiLucro>=0?C.green:C.red},
          {l:`🧾 Faturamento · ${periodoLabel}`,v:kpiFat,c:C.accent},
          {l:`📢 Gasto em Ads · ${periodoLabel}`,v:kpiAds,c:C.red},
          {l:"📈 Lucro Total (tudo)",v:lucroTotal,c:lucroTotal>=0?C.green:C.red},
        ].map((s,i)=>(
          <div key={i} style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:12,padding:"18px 20px"}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.l}</div>
            <div style={{fontSize:24,fontWeight:600,color:s.c,letterSpacing:"-0.02em",fontFamily:"'Geist Mono',monospace"}}>{fmtVal(s.v)}</div>
          </div>
        ))}
      </div>

      {/* FILTROS */}
      <div style={{display:"flex",gap:8,marginBottom:20,alignItems:"center",flexWrap:"wrap",padding:"12px 16px",background:C.surface,borderRadius:12,border:`0.5px solid ${C.border}`}}>
        <span style={{fontSize:12,color:C.textMuted}}>Loja:</span>
        <select value={filtroLoja} onChange={e=>setFiltroLoja(e.target.value)} style={{background:"#1a1a1a",border:`0.5px solid ${C.border}`,color:C.text,fontFamily:"'Geist',sans-serif",fontSize:12,padding:"5px 10px",borderRadius:7,cursor:"pointer",outline:"none"}}>
          <option>Todas</option>
          {lojasCad.map(l=><option key={l.id} value={l.nome}>{l.nome}</option>)}
        </select>
        <select value={filtroMoeda} onChange={e=>setFiltroMoeda(e.target.value)} style={{background:"#1a1a1a",border:`0.5px solid ${C.border}`,color:C.text,fontFamily:"'Geist',sans-serif",fontSize:12,padding:"5px 10px",borderRadius:7,cursor:"pointer",outline:"none"}}>
          {moedas.map(m=><option key={m}>{m}</option>)}
        </select>
        <span style={{fontSize:11,color:taxaInfo.carregando?C.amber:taxaInfo.atualizado==="offline"?C.red:C.green,fontFamily:"'Geist Mono',monospace",display:"flex",alignItems:"center",gap:4}}>
          {taxaInfo.carregando?"⏳ buscando câmbio...":taxaInfo.atualizado==="offline"?"⚠ câmbio offline":`● câmbio ${taxaInfo.atualizado}`}
        </span>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",position:"relative"}}>
          {periodos.map(p=>(
            <button key={p.id} onClick={()=>setFiltroPeriodo(p.id)} style={{padding:"5px 12px",borderRadius:7,fontSize:12,fontFamily:"'Geist',sans-serif",fontWeight:500,cursor:"pointer",background:filtroPeriodo===p.id?C.accentDim:"transparent",color:filtroPeriodo===p.id?C.accent:C.textMuted,border:`0.5px solid ${filtroPeriodo===p.id?C.accentBorder:C.border}`,transition:"all 0.15s"}}>{p.label}</button>
          ))}
          {/* Popover de período personalizado */}
          {filtroPeriodo==="custom"&&(
            <div className="fade-in" style={{position:"absolute",top:"calc(100% + 8px)",left:0,zIndex:200,background:"#161616",border:`0.5px solid ${C.accentBorder}`,borderRadius:12,padding:16,minWidth:280,boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
              <div style={{fontSize:12,fontWeight:500,color:C.text,marginBottom:12}}>Selecionar período</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div>
                  <label style={{fontSize:11,color:C.textMuted,display:"block",marginBottom:5}}>Data início</label>
                  <input type="date" value={filtroDataInicio} onChange={e=>setFiltroDataInicio(e.target.value)}
                    style={{background:"#0d0d0d",border:`0.5px solid ${C.border}`,color:C.text,fontFamily:"'Geist Mono',monospace",fontSize:12,padding:"7px 10px",borderRadius:7,outline:"none",width:"100%"}}/>
                </div>
                <div>
                  <label style={{fontSize:11,color:C.textMuted,display:"block",marginBottom:5}}>Data fim</label>
                  <input type="date" value={filtroDataFim} onChange={e=>setFiltroDataFim(e.target.value)}
                    style={{background:"#0d0d0d",border:`0.5px solid ${C.border}`,color:C.text,fontFamily:"'Geist Mono',monospace",fontSize:12,padding:"7px 10px",borderRadius:7,outline:"none",width:"100%"}}/>
                </div>
              </div>
              {filtroDataInicio&&filtroDataFim&&(
                <div style={{fontSize:11,color:C.green,background:C.greenDim,padding:"6px 10px",borderRadius:6,border:"0.5px solid rgba(34,197,94,0.2)",marginBottom:8}}>
                  ✅ {filtroDataInicio.split("-").reverse().join("/")} → {filtroDataFim.split("-").reverse().join("/")}
                </div>
              )}
              <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                <button onClick={()=>{setFiltroDataInicio("");setFiltroDataFim("");}} style={{fontSize:11,padding:"5px 10px",borderRadius:6,background:"transparent",border:`0.5px solid ${C.border}`,color:C.textMuted,cursor:"pointer",fontFamily:"'Geist',sans-serif"}}>Limpar</button>
                <button onClick={()=>setFiltroPeriodo("total")} style={{fontSize:11,padding:"5px 10px",borderRadius:6,background:"transparent",border:`0.5px solid ${C.border}`,color:C.textMuted,cursor:"pointer",fontFamily:"'Geist',sans-serif"}}>Fechar</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GRÁFICO + LUCRO POR LOJA */}
      <div className="grid-chart">
        <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:12,padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <h2 style={{fontSize:14,fontWeight:500,color:C.text}}>Performance das Lojas</h2>
            <span style={{fontSize:11,color:C.textMuted,fontFamily:"'Geist Mono',monospace"}}>Lucro por dia · últimos 30 registros</span>
          </div>
          <div style={{height:200,position:"relative"}}>
            {chartReady?<LineChart data={graficoDados}/>:<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"}}><Spinner size={20}/></div>}
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:12,padding:20,flex:1}}>
            <h2 style={{fontSize:14,fontWeight:500,color:C.text,marginBottom:14}}>Lucro por loja</h2>
            {lucroPorLoja.length===0
              ?<div style={{fontSize:12,color:C.textMuted}}>Nenhum dado ainda</div>
              :lucroPorLoja.map(({loja,lucro})=>(
                <div key={loja} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`0.5px solid ${C.border}`}}>
                  <span style={{fontSize:12,color:C.text,fontWeight:500}}>{loja}</span>
                  <span style={{fontSize:12,fontWeight:600,color:lucro>=0?C.green:C.red,fontFamily:"'Geist Mono',monospace"}}>{fmtVal(lucro)}</span>
                </div>
              ))
            }
          </div>
          <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:12,padding:16}}>
            <div style={{fontSize:12,fontWeight:500,color:C.text,marginBottom:10}}>Operacional</div>
            {[
              {l:"Tarefas hoje",v:hojeList.length,c:C.accent},
              {l:"Atrasadas",v:atrasadas.length,c:atrasadas.length>0?C.red:C.textMuted},
              {l:"Payments",v:payments.length,c:C.green},
              {l:"Links",v:links.length,c:C.blue},
            ].map(s=>(
              <div key={s.l} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"5px 0",borderBottom:`0.5px solid ${C.border}`}}>
                <span style={{color:C.textMuted}}>{s.l}</span>
                <span style={{color:s.c,fontWeight:600}}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTADOS RECENTES */}
      <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:12,padding:20,marginBottom:20}}>
        <h2 style={{fontSize:14,fontWeight:500,color:C.text,marginBottom:16}}>Resultados Recentes</h2>
        {recentes.length===0?(
          <div style={{textAlign:"center",padding:"24px 0",color:C.textDim,fontSize:13}}>Nenhum resultado ainda. Clique em "Registrar Resultado" para começar.</div>
        ):(
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{borderBottom:`0.5px solid ${C.border}`}}>
                {["Data","Loja","Moeda","Faturamento","Ads","Lucro",""].map((h,i)=>(
                  <th key={i} style={{textAlign:"left",padding:"6px 10px",color:C.textMuted,fontWeight:400,fontSize:11,textTransform:"uppercase",letterSpacing:"0.04em"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentes.map(r=>(
                <tr key={r.id} style={{borderBottom:`0.5px solid ${C.border}`,transition:"background 0.1s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#161616"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"10px 10px",color:C.textMuted,fontFamily:"'Geist Mono',monospace"}}>{r.date?.slice(0,10)}</td>
                  <td style={{padding:"10px 10px",color:C.text,fontWeight:500}}>{r.store_name}</td>
                  <td style={{padding:"10px 10px"}}><Badge label={r.currency}/></td>
                  <td style={{padding:"10px 10px",color:C.textMuted,fontFamily:"'Geist Mono',monospace"}}>{(r.revenue||0).toLocaleString("pt-BR",{minimumFractionDigits:2})}</td>
                  <td style={{padding:"10px 10px",color:C.red,fontFamily:"'Geist Mono',monospace"}}>{(r.ad_spend||0).toLocaleString("pt-BR",{minimumFractionDigits:2})}</td>
                  <td style={{padding:"10px 10px",color:(r.profit||0)>=0?C.green:C.red,fontWeight:600,fontFamily:"'Geist Mono',monospace"}}>{fmtVal(converter(r.profit,r.currency))}</td>
                  <td style={{padding:"10px 10px"}}>
                    <div style={{display:"flex",gap:4,justifyContent:"flex-end"}}>
                      <button onClick={()=>openEditProfit(r)} title="Editar" style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",padding:5,borderRadius:5,transition:"color 0.15s"}}
                        onMouseEnter={e=>e.currentTarget.style.color=C.accent} onMouseLeave={e=>e.currentTarget.style.color=C.textDim}>
                        <Icon name="edit" size={13}/>
                      </button>
                      <button onClick={()=>deleteProfit(r.id)} title="Excluir" style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",padding:5,borderRadius:5,transition:"color 0.15s"}}
                        onMouseEnter={e=>e.currentTarget.style.color=C.red} onMouseLeave={e=>e.currentTarget.style.color=C.textDim}>
                        <Icon name="trash" size={13}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* TAREFAS + LINKS */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
        <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:12,padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h2 style={{fontSize:14,fontWeight:500,color:C.text}}>Tarefas de hoje</h2><Btn small onClick={()=>setPage("tarefas")}>Ver todas</Btn></div>
          {hojeList.length===0?<div style={{fontSize:13,color:C.textMuted}}>Nenhuma tarefa para hoje 🎉</div>:hojeList.map(t=>(
            <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:"#0d0d0d",borderRadius:8,border:`0.5px solid ${C.border}`,marginBottom:6}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:{Alta:C.red,Média:C.amber,Baixa:C.blue}[t.priority],flexShrink:0}}/>
              <span style={{fontSize:13,color:C.text,flex:1}}>{t.title}</span>
              <Badge label={t.priority} color={priorityColor(t.priority)}/>
            </div>
          ))}
          {atrasadas.length>0&&<div style={{marginTop:8,padding:"8px 12px",background:C.redDim,borderRadius:8,border:"0.5px solid rgba(239,68,68,0.2)",fontSize:12,color:C.red}}>⚠ {atrasadas.length} atrasada{atrasadas.length>1?"s":""}</div>}
        </div>
        <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:12,padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h2 style={{fontSize:14,fontWeight:500,color:C.text}}>Links salvos</h2><Btn small onClick={()=>setPage("links")}>Ver todos</Btn></div>
          {links.length===0?<div style={{fontSize:13,color:C.textMuted}}>Nenhum link ainda</div>:links.slice(0,4).map(l=>(
            <div key={l.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:"#0d0d0d",borderRadius:8,border:`0.5px solid ${C.border}`,marginBottom:6}}>
              <div style={{width:26,height:26,borderRadius:6,background:C.blueDim,display:"flex",alignItems:"center",justifyContent:"center",color:C.blue,flexShrink:0}}><Icon name="link" size={12}/></div>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:500,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.title||l.url}</div></div>
              <Badge label={l.status} color={statusColor(l.status)}/>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL REGISTRAR */}
      {modalResultado&&(
        <Modal title={editProfit?"Editar Resultado":"Registrar Resultado"} onClose={closeModal}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Loja</label>
              {lojasCad.length===0?(
                <div style={{padding:"10px 12px",background:"#0d0d0d",borderRadius:8,border:`0.5px solid ${C.border}`,fontSize:12,color:C.amber,display:"flex",alignItems:"center",gap:8}}>
                  <Icon name="alert" size={13}/>
                  Nenhuma loja cadastrada. Vá em <strong style={{color:C.accent,cursor:"pointer"}} onClick={()=>setModalResultado(false)}>Lojas</strong> para cadastrar.
                </div>
              ):(
                <select value={form.store_name} onChange={e=>setForm(p=>({...p,store_name:e.target.value}))}
                  style={{background:"#0d0d0d",border:`0.5px solid ${C.border}`,color:form.store_name?C.text:C.textMuted,fontFamily:"'Geist',sans-serif",fontSize:13,padding:"9px 12px",borderRadius:8,outline:"none",width:"100%",cursor:"pointer"}}
                  onFocus={e=>e.target.style.borderColor=C.accentBorder} onBlur={e=>e.target.style.borderColor=C.border}>
                  <option value="">Selecionar loja...</option>
                  {lojasCad.map(l=><option key={l.id} value={l.nome}>{l.nome} · {l.moeda}</option>)}
                </select>
              )}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Data</label>
                <Input type="date" value={form.date} onChange={v=>setForm(p=>({...p,date:v}))}/>
              </div>
              <div>
                <label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Moeda</label>
                <select value={form.currency} onChange={e=>setForm(p=>({...p,currency:e.target.value}))} style={{background:"#0d0d0d",border:`0.5px solid ${C.border}`,color:C.text,fontFamily:"'Geist',sans-serif",fontSize:13,padding:"9px 12px",borderRadius:8,outline:"none",width:"100%"}}>
                  {moedas.map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Faturamento</label>
              <Input value={form.revenue} onChange={v=>setForm(p=>({...p,revenue:v}))} placeholder="Ex: 1200.00"/>
            </div>
            <div>
              <label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Gasto em Ads</label>
              <Input value={form.ad_spend} onChange={v=>setForm(p=>({...p,ad_spend:v}))} placeholder="Ex: 400.00"/>
            </div>
            <div style={{padding:"12px 14px",background:"#0d0d0d",borderRadius:9,border:`0.5px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,color:C.textMuted}}>Lucro calculado</span>
              <span style={{fontSize:18,fontWeight:600,fontFamily:"'Geist Mono',monospace",color:(parseFloat(form.revenue.replace(",","."))||0)-(parseFloat((form.ad_spend||"0").replace(",","."))||0)>=0?C.green:C.red}}>
                {fmtVal((parseFloat(form.revenue.replace(",","."))||0)-(parseFloat((form.ad_spend||"0").replace(",","."))||0))}
              </span>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn variant="outline" onClick={closeModal}>Cancelar</Btn>
              <Btn variant="primary" onClick={registrar} loading={saving}>{editProfit?"Salvar alterações":"Registrar"}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── LINKS ────────────────────────────────────────────────────────────────────
const LinksPage=({sb,user})=>{
  const [links,setLinks]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [modal,setModal]=useState(false);
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({url:"",title:"",notes:"",tags:"",status:"Novo",categoria:"Produtos"});
  const dragging=useRef(null);
  const colRefs=useRef({});
  const {show,El}=useToast();

  useEffect(()=>{
    sb.from("links").select("*").eq("user_id",user.id).order("created_at",{ascending:false})
      .then(({data})=>{setLinks(data||[]);setLoading(false);});
  },[]);

  const add=async()=>{
    if(!form.url){show("URL é obrigatória","error");return;}
    setSaving(true);
    const tags=form.tags.split(",").map(t=>t.trim()).filter(Boolean);
    const{data,error}=await sb.from("links").insert({user_id:user.id,...form,tags,title:form.title||form.url}).select().single();
    if(error){show("Erro: "+error.message,"error");}
    else{setLinks(p=>[data,...p]);show("Link salvo!");setModal(false);setForm({url:"",title:"",notes:"",tags:"",status:"Novo",categoria:"Produtos"});}
    setSaving(false);
  };

  const del=async(id)=>{
    await sb.from("links").delete().eq("id",id);
    setLinks(p=>p.filter(l=>l.id!==id));
    show("Removido");
  };

  const moveCategoria=async(id,categoria)=>{
    await sb.from("links").update({categoria}).eq("id",id);
    setLinks(p=>p.map(l=>l.id===id?{...l,categoria}:l));
  };

  const onDS=(e,l)=>{dragging.current=l;setTimeout(()=>e.target.closest("[data-card]")?.classList.add("dragging-card"),0);e.dataTransfer.effectAllowed="move";};
  const onDE=(e)=>{e.target.closest("[data-card]")?.classList.remove("dragging-card");document.querySelectorAll(".drag-over-col").forEach(el=>el.classList.remove("drag-over-col"));};
  const onDO=(e,el)=>{e.preventDefault();document.querySelectorAll(".drag-over-col").forEach(x=>x.classList.remove("drag-over-col"));el?.classList.add("drag-over-col");};
  const onDrop=(e,cat,el)=>{e.preventDefault();el?.classList.remove("drag-over-col");if(dragging.current){moveCategoria(dragging.current.id,cat);dragging.current=null;}};

  const cols=[
    {id:"Produtos",label:"Produtos",icon:"store",color:C.blue,colorDim:C.blueDim},
    {id:"Vídeos",label:"Vídeos",icon:"video",color:C.accent,colorDim:C.accentDim},
  ];

  const filtered=links.filter(l=>(l.title||"").toLowerCase().includes(search.toLowerCase())||(l.url||"").toLowerCase().includes(search.toLowerCase()));

  const CardLink=({l})=>{
    const [hov,setHov]=useState(false);
    const col=cols.find(c=>c.id===l.categoria)||cols[0];
    return(
      <div data-card draggable onDragStart={e=>onDS(e,l)} onDragEnd={onDE}
        style={{background:"#0d0d0d",border:`0.5px solid ${hov?C.borderHover:C.border}`,borderRadius:12,padding:"14px",cursor:"grab",userSelect:"none",transition:"all 0.15s"}}
        onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
        {/* Ícone + título */}
        <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:col.colorDim,display:"flex",alignItems:"center",justifyContent:"center",color:col.color,flexShrink:0}}>
            <Icon name={col.icon} size={14}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:500,color:C.text,lineHeight:1.4,wordBreak:"break-word"}}>{l.title||l.url}</div>
            <div style={{fontSize:10,color:C.textMuted,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.url}</div>
          </div>
        </div>
        {/* Notas */}
        {l.notes&&<div style={{fontSize:11,color:C.textMuted,marginBottom:10,lineHeight:1.5,background:"#111",borderRadius:6,padding:"6px 8px"}}>{l.notes}</div>}
        {/* Tags */}
        {(l.tags||[]).length>0&&(
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
            {l.tags.map(t=><Badge key={t} label={t}/>)}
          </div>
        )}
        {/* Footer */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:4}}>
          <Badge label={l.status} color={statusColor(l.status)}/>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            <a href={l.url} target="_blank" rel="noreferrer" style={{color:C.textDim,display:"flex",padding:4}}><Icon name="externalLink" size={12}/></a>
            <button onClick={()=>del(l.id)} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",padding:4,display:"flex"}}><Icon name="trash" size={12}/></button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-pad" style={{overflowY:"auto",flex:1}}>
      {El}
      {/* HEADER */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:600,color:C.text,letterSpacing:"-0.03em"}}>Links</h1>
          <p style={{fontSize:13,color:C.textMuted,marginTop:2}}>Lojas concorrentes · {links.length} links salvos</p>
        </div>
        <Btn variant="primary" icon="plus" onClick={()=>setModal(true)}>Adicionar</Btn>
      </div>

      {/* BUSCA */}
      <div style={{position:"relative",maxWidth:360,marginBottom:24}}>
        <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.textMuted}}><Icon name="search" size={14}/></span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar link..." style={{width:"100%",background:C.surface,border:`0.5px solid ${C.border}`,color:C.text,fontFamily:"'Geist',sans-serif",fontSize:13,padding:"8px 12px 8px 32px",borderRadius:8,outline:"none"}}/>
      </div>

      {/* KANBAN */}
      {loading?<div style={{textAlign:"center",padding:40}}><Spinner size={24}/></div>:(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16,alignItems:"start"}}>
          {cols.map(col=>{
            const items=filtered.filter(l=>l.categoria===col.id);
            return(
              <div key={col.id}>
                {/* Cabeçalho da coluna */}
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"10px 14px",background:col.colorDim,borderRadius:10,border:`0.5px solid ${col.color}33`}}>
                  <Icon name={col.icon} size={15}/>
                  <span style={{fontSize:13,fontWeight:600,color:col.color}}>{col.label}</span>
                  <span style={{fontSize:11,color:col.color,opacity:0.6,marginLeft:"auto",fontFamily:"'Geist Mono',monospace"}}>{items.length}</span>
                </div>
                {/* Área de drop */}
                <div
                  ref={el=>{if(el)colRefs.current[col.id]=el;}}
                  onDragOver={e=>onDO(e,colRefs.current[col.id])}
                  onDrop={e=>onDrop(e,col.id,colRefs.current[col.id])}
                  style={{display:"flex",flexDirection:"column",gap:10,minHeight:120,borderRadius:10,padding:6,border:"1px solid transparent",transition:"all 0.15s"}}>
                  {items.map(l=><CardLink key={l.id} l={l}/>)}
                  {items.length===0&&(
                    <div style={{padding:"28px 0",textAlign:"center",color:C.textDim,fontSize:12,border:`0.5px dashed ${C.border}`,borderRadius:10}}>
                      Solte um card aqui
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {modal&&(
        <Modal title="Adicionar Link" onClose={()=>setModal(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div>
              <label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Categoria</label>
              <div style={{display:"flex",gap:8}}>
                {cols.map(c=>(
                  <button key={c.id} onClick={()=>setForm(p=>({...p,categoria:c.id}))}
                    style={{flex:1,padding:"8px",borderRadius:8,fontSize:13,fontFamily:"'Geist',sans-serif",fontWeight:500,cursor:"pointer",background:form.categoria===c.id?c.colorDim:"transparent",color:form.categoria===c.id?c.color:C.textMuted,border:`0.5px solid ${form.categoria===c.id?c.color+"55":C.border}`,transition:"all 0.15s",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    <Icon name={c.icon} size={13}/>{c.label}
                  </button>
                ))}
              </div>
            </div>
            <Input value={form.url} onChange={v=>setForm(p=>({...p,url:v}))} placeholder="https://..." onKeyDown={e=>e.key==="Enter"&&add()}/>
            <Input value={form.title} onChange={v=>setForm(p=>({...p,title:v}))} placeholder="Título (opcional)"/>
            <Input value={form.tags} onChange={v=>setForm(p=>({...p,tags:v}))} placeholder="Etiquetas (vírgula)"/>
            <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Observações..." rows={3} style={{background:"#0d0d0d",border:`0.5px solid ${C.border}`,color:C.text,fontFamily:"'Geist',sans-serif",fontSize:13,padding:"8px 12px",borderRadius:8,outline:"none",resize:"none"}}/>
            <div>
              <label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Status</label>
              <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))} style={{background:"#0d0d0d",border:`0.5px solid ${C.border}`,color:C.text,fontFamily:"'Geist',sans-serif",fontSize:13,padding:"8px 12px",borderRadius:8,outline:"none",width:"100%"}}>
                {["Novo","Revisando","Aprovado","Rejeitado"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn variant="outline" onClick={()=>setModal(false)}>Cancelar</Btn>
              <Btn variant="primary" onClick={add} loading={saving}>Salvar Link</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── TAREFAS ──────────────────────────────────────────────────────────────────
const TarefasPage=({sb,user})=>{
  const [tasks,setTasks]=useState([]);
  const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState(false);
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({title:"",description:"",status:"A fazer",priority:"Média",due_date:""});
  const dragging=useRef(null);
  const colRefs=useRef({});
  const {show,El}=useToast();
  useEffect(()=>{sb.from("tarefas").select("*").eq("user_id",user.id).order("created_at",{ascending:false}).then(({data})=>{setTasks(data||[]);setLoading(false);});},[]);
  const add=async()=>{
    if(!form.title.trim()){show("Título é obrigatório","error");return;}
    setSaving(true);
    const{data,error}=await sb.from("tarefas").insert({user_id:user.id,...form,due_date:form.due_date||null}).select().single();
    if(error){show("Erro: "+error.message,"error");}else{setTasks(p=>[data,...p]);show("Tarefa criada!");setModal(false);setForm({title:"",description:"",status:"A fazer",priority:"Média",due_date:""});}
    setSaving(false);
  };
  const toggle=async(t)=>{const ns=t.status==="Concluído"?"A fazer":"Concluído";await sb.from("tarefas").update({status:ns}).eq("id",t.id);setTasks(p=>p.map(x=>x.id===t.id?{...x,status:ns}:x));};
  const del=async(id)=>{await sb.from("tarefas").delete().eq("id",id);setTasks(p=>p.filter(x=>x.id!==id));show("Removida");};
  const move=async(id,status)=>{await sb.from("tarefas").update({status}).eq("id",id);setTasks(p=>p.map(t=>t.id===id?{...t,status}:t));};
  const onDS=(e,t)=>{dragging.current=t;setTimeout(()=>e.target.classList.add("dragging-card"),0);e.dataTransfer.effectAllowed="move";};
  const onDE=(e)=>{e.target.classList.remove("dragging-card");document.querySelectorAll(".drag-over-col").forEach(el=>el.classList.remove("drag-over-col"));};
  const onDO=(e,el)=>{e.preventDefault();document.querySelectorAll(".drag-over-col").forEach(x=>x.classList.remove("drag-over-col"));el.classList.add("drag-over-col");};
  const onDrop=(e,colId,el)=>{e.preventDefault();el.classList.remove("drag-over-col");if(dragging.current){move(dragging.current.id,colId);dragging.current=null;}};
  const cols=[{id:"A fazer",label:"A fazer",color:C.textMuted},{id:"Hoje",label:"Hoje",color:C.accent},{id:"Atrasado",label:"Atrasado",color:C.red},{id:"Concluído",label:"Concluído",color:C.green}];
  const fmt=d=>{if(!d)return null;const[y,m,dd]=d.slice(0,10).split("-");return`${dd}/${m}/${y}`;};
  const late=t=>t.due_date&&t.status!=="Concluído"&&new Date(t.due_date)<new Date(new Date().toDateString());
  return (
    <div className="page-pad" style={{overflowY:"auto",flex:1}}>
      {El}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div><h1 style={{fontSize:22,fontWeight:600,color:C.text,letterSpacing:"-0.03em"}}>Tarefas</h1><p style={{fontSize:13,color:C.textMuted,marginTop:2}}>{tasks.filter(t=>t.status!=="Concluído").length} ativas · arraste para mover</p></div>
        <Btn variant="primary" icon="plus" onClick={()=>setModal(true)}>Nova Tarefa</Btn>
      </div>
      {loading?<div style={{textAlign:"center",padding:40}}><Spinner size={24}/></div>:(
        <div className="grid-tasks-4">
          {cols.map(col=>{
            const ct=tasks.filter(t=>t.status===col.id);
            return (
              <div key={col.id}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><div style={{width:6,height:6,borderRadius:"50%",background:col.color}}/><span style={{fontSize:12,fontWeight:500,color:col.color,textTransform:"uppercase",letterSpacing:"0.05em"}}>{col.label}</span><span style={{fontSize:11,color:C.textDim,marginLeft:"auto"}}>{ct.length}</span></div>
                <div ref={el=>{if(el)colRefs.current[col.id]=el;}} onDragOver={e=>onDO(e,colRefs.current[col.id])} onDrop={e=>onDrop(e,col.id,colRefs.current[col.id])} style={{display:"flex",flexDirection:"column",gap:8,minHeight:80,borderRadius:10,padding:6,border:"1px solid transparent",transition:"all 0.15s"}}>
                  {ct.map(t=>(
                    <div key={t.id} draggable onDragStart={e=>onDS(e,t)} onDragEnd={onDE} style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:10,padding:"12px",cursor:"grab",userSelect:"none",transition:"border-color 0.15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderHover} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                      <div style={{display:"flex",justifyContent:"space-between",gap:6,marginBottom:6}}>
                        <div style={{display:"flex",gap:6,flex:1}}><span style={{color:C.textDim,marginTop:2,flexShrink:0}}><Icon name="grip" size={12}/></span><span style={{fontSize:13,fontWeight:500,color:t.status==="Concluído"?C.textDim:C.text,textDecoration:t.status==="Concluído"?"line-through":"none",lineHeight:1.4}}>{t.title}</span></div>
                        <button onClick={()=>toggle(t)} style={{background:t.status==="Concluído"?C.greenDim:"#1a1a1a",border:`0.5px solid ${t.status==="Concluído"?"rgba(34,197,94,0.3)":C.border}`,color:t.status==="Concluído"?C.green:C.textDim,borderRadius:5,width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>{t.status==="Concluído"&&<Icon name="check" size={10}/>}</button>
                      </div>
                      {t.description&&<p style={{fontSize:11,color:C.textMuted,marginBottom:8,lineHeight:1.5,paddingLeft:18}}>{t.description}</p>}
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingLeft:18}}>
                        <Badge label={t.priority} color={priorityColor(t.priority)}/>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          {t.due_date&&<span style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:late(t)?C.red:C.textDim,fontFamily:"'Geist Mono',monospace",background:late(t)?C.redDim:"transparent",padding:late(t)?"2px 5px":"0",borderRadius:4}}><Icon name="calendar" size={10}/>{fmt(t.due_date)}</span>}
                          <button onClick={()=>del(t.id)} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",padding:2}}><Icon name="trash" size={12}/></button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {ct.length===0&&<div style={{padding:"18px 0",textAlign:"center",color:C.textDim,fontSize:12,border:`0.5px dashed ${C.border}`,borderRadius:10}}>Solte aqui</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {modal&&(
        <Modal title="Nova Tarefa" onClose={()=>setModal(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Input value={form.title} onChange={v=>setForm(p=>({...p,title:v}))} placeholder="Título da tarefa..."/>
            <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="Descrição..." rows={2} style={{background:"#0d0d0d",border:`0.5px solid ${C.border}`,color:C.text,fontFamily:"'Geist',sans-serif",fontSize:13,padding:"8px 12px",borderRadius:8,outline:"none",resize:"none"}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))} style={{background:"#0d0d0d",border:`0.5px solid ${C.border}`,color:C.text,fontFamily:"'Geist',sans-serif",fontSize:13,padding:"8px 12px",borderRadius:8,outline:"none"}}>{["A fazer","Hoje","Atrasado","Concluído"].map(s=><option key={s}>{s}</option>)}</select>
              <select value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))} style={{background:"#0d0d0d",border:`0.5px solid ${C.border}`,color:C.text,fontFamily:"'Geist',sans-serif",fontSize:13,padding:"8px 12px",borderRadius:8,outline:"none"}}>{["Baixa","Média","Alta"].map(s=><option key={s}>{s}</option>)}</select>
            </div>
            <div><label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Data de vencimento</label><Input type="date" value={form.due_date} onChange={v=>setForm(p=>({...p,due_date:v}))}/></div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="outline" onClick={()=>setModal(false)}>Cancelar</Btn><Btn variant="primary" onClick={add} loading={saving}>Criar Tarefa</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── VÍDEOS ───────────────────────────────────────────────────────────────────
const VideosPage=({sb,user})=>{
  const [videos,setVideos]=useState([]);
  const [loading,setLoading]=useState(true);
  const [sel,setSel]=useState(null);
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({title:"",description:"",tags:""});
  const {show,El}=useToast();
  const colors=["#7c6bff","#3b82f6","#22c55e","#f59e0b","#ef4444","#ec4899"];
  useEffect(()=>{sb.from("videos").select("*").eq("user_id",user.id).order("created_at",{ascending:false}).then(({data})=>{setVideos(data||[]);setLoading(false);});},[]);
  const add=async()=>{
    if(!form.title){show("Título é obrigatório","error");return;}
    const tags=form.tags.split(",").map(t=>t.trim()).filter(Boolean);
    const{data,error}=await sb.from("videos").insert({user_id:user.id,title:form.title,description:form.description,tags}).select().single();
    if(error){show("Erro: "+error.message,"error");}else{setVideos(p=>[data,...p]);show("Vídeo salvo!");setModal(false);setForm({title:"",description:"",tags:""});}
  };
  const del=async(id)=>{await sb.from("videos").delete().eq("id",id);setVideos(p=>p.filter(v=>v.id!==id));show("Removido");};
  return (
    <div className="page-pad" style={{overflowY:"auto",flex:1}}>
      {El}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div><h1 style={{fontSize:22,fontWeight:600,color:C.text,letterSpacing:"-0.03em"}}>Vídeos</h1><p style={{fontSize:13,color:C.textMuted,marginTop:2}}>{videos.length} vídeos</p></div>
        <Btn variant="primary" icon="plus" onClick={()=>setModal(true)}>Adicionar Vídeo</Btn>
      </div>
      {loading?<div style={{textAlign:"center",padding:40}}><Spinner size={24}/></div>:(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
          {videos.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:40,color:C.textMuted,fontSize:13}}>Nenhum vídeo ainda</div>}
          {videos.map((v,i)=>(
            <div key={v.id} style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:12,overflow:"hidden",transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.borderHover;e.currentTarget.style.transform="translateY(-1px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";}}>
              <div onClick={()=>setSel(v)} style={{height:120,background:colors[i%colors.length]+"22",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}><Icon name="play" size={14}/></div>
              </div>
              <div style={{padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:500,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.title}</div><div style={{fontSize:10,color:C.textDim,marginTop:3,fontFamily:"'Geist Mono',monospace"}}>{(v.created_at||"").slice(0,10)}</div></div>
                <button onClick={()=>del(v.id)} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",padding:2,flexShrink:0}}><Icon name="trash" size={13}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {sel&&(<Modal title={sel.title} onClose={()=>setSel(null)}><div style={{background:"#0a0a0a",borderRadius:10,height:180,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16,color:C.accent}}><Icon name="play" size={36}/></div><div style={{fontSize:13,color:C.textMuted,marginBottom:10}}>{sel.description}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{(sel.tags||[]).map(t=><Badge key={t} label={t}/>)}</div></Modal>)}
      {modal&&(<Modal title="Adicionar Vídeo" onClose={()=>setModal(false)}><div style={{display:"flex",flexDirection:"column",gap:12}}><Input value={form.title} onChange={v=>setForm(p=>({...p,title:v}))} placeholder="Título..."/><Input value={form.description} onChange={v=>setForm(p=>({...p,description:v}))} placeholder="Descrição..."/><Input value={form.tags} onChange={v=>setForm(p=>({...p,tags:v}))} placeholder="Etiquetas (vírgula)"/><div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="outline" onClick={()=>setModal(false)}>Cancelar</Btn><Btn variant="primary" onClick={add}>Salvar</Btn></div></div></Modal>)}
    </div>
  );
};

// ─── ARQUIVOS ─────────────────────────────────────────────────────────────────
const ArquivosPage=({sb,user})=>{
  const [pastas,setPastas]=useState([]);
  const [arquivos,setArquivos]=useState([]);
  const [loading,setLoading]=useState(true);
  const [uploading,setUploading]=useState(false);
  const [cur,setCur]=useState(null);
  const [bc,setBc]=useState([]);
  const [search,setSearch]=useState("");
  const [drag,setDrag]=useState(false);
  const [newP,setNewP]=useState(false);
  const [newPN,setNewPN]=useState("");
  const [renaming,setRenaming]=useState(null);
  const [rv,setRv]=useState("");
  const fileRef=useRef();
  const {show,El}=useToast();
  useEffect(()=>{Promise.all([sb.from("pastas").select("*").eq("user_id",user.id),sb.from("arquivos").select("*").eq("user_id",user.id).order("created_at",{ascending:false})]).then(([p,a])=>{setPastas(p.data||[]);setArquivos(a.data||[]);setLoading(false);});},[]);
  const nav=p=>{setBc(x=>[...x,p]);setCur(p.id);};
  const navC=idx=>{if(idx===-1){setCur(null);setBc([]);return;}const nc=bc.slice(0,idx+1);setBc(nc);setCur(nc[nc.length-1].id);};
  const mkP=async()=>{if(!newPN.trim())return;const{data,error}=await sb.from("pastas").insert({user_id:user.id,name:newPN.trim(),parent_id:cur}).select().single();if(error){show("Erro","error");}else{setPastas(p=>[...p,data]);show("Pasta criada!");setNewPN("");setNewP(false);}};
  const doRen=async()=>{if(!renaming||!rv.trim())return;if(renaming.t==="pasta"){await sb.from("pastas").update({name:rv}).eq("id",renaming.id);setPastas(p=>p.map(x=>x.id===renaming.id?{...x,name:rv}:x));}else{await sb.from("arquivos").update({name:rv}).eq("id",renaming.id);setArquivos(p=>p.map(x=>x.id===renaming.id?{...x,name:rv}:x));}setRenaming(null);show("Renomeado!");};
  const delP=async(id)=>{await sb.from("pastas").delete().eq("id",id);setPastas(p=>p.filter(x=>x.id!==id));show("Pasta removida");};
  const delA=async(id,url)=>{if(url){try{const path=url.split("/object/public/arquivos/")[1];if(path)await sb.storage.from("arquivos").remove([decodeURIComponent(path)]);}catch(e){}}await sb.from("arquivos").delete().eq("id",id);setArquivos(p=>p.filter(x=>x.id!==id));show("Removido");};
  const upload=async(files)=>{
    setUploading(true);
    for(const file of Array.from(files)){
      const ext=(file.name.split(".").pop()||"").toLowerCase();
      const path=`${user.id}/${Date.now()}_${file.name}`;
      const{error:upErr}=await sb.storage.from("arquivos").upload(path,file);
      if(upErr){show("Erro: "+upErr.message,"error");continue;}
      const url=sb.storage.from("arquivos").getPublicUrl(path).data.publicUrl;
      const ftype=["jpg","jpeg","png","gif","webp"].includes(ext)?"image":["mp4","mov","webm"].includes(ext)?"video":ext==="pdf"?"pdf":"outro";
      const{data}=await sb.from("arquivos").insert({user_id:user.id,pasta_id:cur,name:file.name,file_url:url,file_type:ftype,tags:[]}).select().single();
      if(data)setArquivos(p=>[data,...p]);
    }
    show("Enviado!");setUploading(false);
  };
  const items=search?[...pastas.filter(f=>f.name.toLowerCase().includes(search.toLowerCase())).map(f=>({...f,_t:"pasta"})),...arquivos.filter(f=>f.name.toLowerCase().includes(search.toLowerCase())).map(f=>({...f,_t:"arquivo"}))]:[...pastas.filter(f=>f.parent_id===cur).map(f=>({...f,_t:"pasta"})),...arquivos.filter(f=>f.pasta_id===cur).map(f=>({...f,_t:"arquivo"}))];
  const fIcon=t=>({pdf:"pdf",image:"image",video:"video"}[t]||"file");
  const fColor=t=>({pdf:"#ef4444",image:"#3b82f6",video:"#7c6bff"}[t]||C.textMuted);
  const fColorDim=t=>({pdf:C.redDim,image:C.blueDim,video:C.accentDim}[t]||"#1a1a1a");
  const fLabel=t=>({pdf:"PDF",image:"Imagem",video:"Vídeo",outro:"Arquivo"}[t]||"Arquivo");
  return (
    <div className="page-pad" style={{overflowY:"auto",flex:1}}>
      {El}
      <input ref={fileRef} type="file" multiple style={{display:"none"}} onChange={e=>upload(e.target.files)}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div><h1 style={{fontSize:22,fontWeight:600,color:C.text,letterSpacing:"-0.03em"}}>Arquivos</h1><p style={{fontSize:13,color:C.textMuted,marginTop:2}}>Seu drive privado</p></div>
        <div style={{display:"flex",gap:8}}><Btn variant="outline" icon="folder" onClick={()=>setNewP(true)}>Nova Pasta</Btn><Btn variant="primary" icon="upload" loading={uploading} onClick={()=>fileRef.current.click()}>{uploading?"Enviando...":"Enviar"}</Btn></div>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:14}}><div style={{position:"relative",flex:1,maxWidth:340}}><span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.textMuted}}><Icon name="search" size={14}/></span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{width:"100%",background:C.surface,border:`0.5px solid ${C.border}`,color:C.text,fontFamily:"'Geist',sans-serif",fontSize:13,padding:"8px 12px 8px 32px",borderRadius:8,outline:"none"}}/></div></div>
      {!search&&(<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14,padding:"8px 12px",background:C.surface,borderRadius:8,border:`0.5px solid ${C.border}`,flexWrap:"wrap"}}><button onClick={()=>navC(-1)} style={{background:"none",border:"none",color:cur?C.textMuted:C.text,cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:13,padding:"2px 4px",display:"flex",alignItems:"center",gap:6}}><Icon name="home" size={13}/> Início</button>{bc.map((b,i)=><span key={b.id} style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:C.textDim}}><Icon name="chevronRight" size={12}/></span><button onClick={()=>navC(i)} style={{background:"none",border:"none",color:i===bc.length-1?C.text:C.textMuted,cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:13,padding:"2px 4px"}}>{b.name}</button></span>)}</div>)}
      {newP&&(<div style={{display:"flex",gap:8,marginBottom:14,padding:12,background:C.surface,borderRadius:10,border:`0.5px solid ${C.accentBorder}`}}><input autoFocus value={newPN} onChange={e=>setNewPN(e.target.value)} onKeyDown={e=>e.key==="Enter"&&mkP()} placeholder="Nome da pasta..." style={{flex:1,background:"#0d0d0d",border:`0.5px solid ${C.border}`,color:C.text,fontFamily:"'Geist',sans-serif",fontSize:13,padding:"7px 12px",borderRadius:7,outline:"none"}}/><Btn variant="primary" small onClick={mkP}>Criar</Btn><Btn variant="outline" small onClick={()=>{setNewP(false);setNewPN("");}}>Cancelar</Btn></div>)}
      {loading?<div style={{textAlign:"center",padding:40}}><Spinner size={24}/></div>:(
        <div style={{border:`1px dashed ${drag?C.accentBorder:"transparent"}`,borderRadius:12,background:drag?C.accentDim:"transparent",transition:"all 0.2s",padding:4}} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);upload(e.dataTransfer.files);}}>
          {items.length===0&&<div style={{textAlign:"center",padding:"50px 0",color:C.textDim}}><Icon name="folder" size={28}/><div style={{fontSize:13,marginTop:10}}>Solte arquivos aqui ou crie uma pasta</div></div>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10}}>
            {items.map(item=>{
              const isP=item._t==="pasta";
              return (
                <div key={(isP?"p":"a")+item.id} onDoubleClick={()=>isP&&nav(item)} style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:12,padding:"14px 12px",cursor:isP?"pointer":"default",transition:"all 0.15s",userSelect:"none"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.borderHover;e.currentTarget.style.background=C.surfaceHover;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div style={{width:34,height:34,borderRadius:7,background:isP?"#2a1f00":fColorDim(item.file_type),display:"flex",alignItems:"center",justifyContent:"center",color:isP?C.amber:fColor(item.file_type),overflow:"hidden",flexShrink:0}}>
                      {!isP&&item.file_type==="image"&&item.file_url?<img src={item.file_url} style={{width:34,height:34,objectFit:"cover"}} alt=""/>:<Icon name={isP?"folder":fIcon(item.file_type)} size={16}/>}
                    </div>
                    <div style={{display:"flex",gap:3}}><button onClick={()=>{setRenaming({id:item.id,t:isP?"pasta":"arquivo"});setRv(item.name);}} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",padding:3}}><Icon name="edit" size={12}/></button><button onClick={()=>isP?delP(item.id):delA(item.id,item.file_url)} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",padding:3}}><Icon name="trash" size={12}/></button></div>
                  </div>
                  {renaming&&renaming.id===item.id?<input autoFocus value={rv} onChange={e=>setRv(e.target.value)} onBlur={doRen} onKeyDown={e=>e.key==="Enter"&&doRen()} style={{background:"#0a0a0a",border:`0.5px solid ${C.accentBorder}`,color:C.text,fontFamily:"'Geist',sans-serif",fontSize:12,padding:"3px 6px",borderRadius:5,outline:"none",width:"100%"}}/>:<div style={{fontSize:12,fontWeight:500,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>}
                  <div style={{fontSize:10,color:C.textDim,marginTop:3,fontFamily:"'Geist Mono',monospace"}}>{isP?"pasta":fLabel(item.file_type)}</div>
                  {isP&&<div style={{fontSize:10,color:C.textMuted,marginTop:4}}>clique duplo para abrir</div>}
                  {!isP&&item.file_url&&item.file_type!=="image"&&<a href={item.file_url} target="_blank" rel="noreferrer" style={{fontSize:10,color:C.accent,display:"block",marginTop:4}}>Abrir ↗</a>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── PAYMENTS ─────────────────────────────────────────────────────────────────
const PaymentsPage=({sb,user})=>{
  const [payments,setPayments]=useState([]);
  const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState(false);
  const [editItem,setEditItem]=useState(null);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("Todos");
  const [saving,setSaving]=useState(false);
  const emptyForm={nome:"",loja:"",status:"Aquecimento",ciclo:"D7",data_saida:"",notas:""};
  const [form,setForm]=useState(emptyForm);
  const {show,El}=useToast();
  const ciclos=["D3","D5","D7","D14"];
  const cicloColor=c=>({D3:"#ef4444",D5:"#f59e0b",D7:"#22c55e",D14:"#3b82f6"}[c]||C.textMuted);
  const cicloColorDim=c=>({D3:C.redDim,D5:C.amberDim,D7:C.greenDim,D14:C.blueDim}[c]||"#1a1a1a");

  useEffect(()=>{sb.from("payments").select("*").eq("user_id",user.id).order("created_at",{ascending:false}).then(({data})=>{setPayments(data||[]);setLoading(false);});},[]);

  const openNew=()=>{setForm(emptyForm);setEditItem(null);setModal(true);};
  const openEdit=(p)=>{setForm({nome:p.nome,loja:p.loja||"",status:p.status,ciclo:p.ciclo,data_saida:p.data_saida||"",notas:p.notas||""});setEditItem(p);setModal(true);};

  const submit=async()=>{
    if(!form.nome.trim()){show("Nome é obrigatório","error");return;}
    setSaving(true);
    if(editItem){
      const{error}=await sb.from("payments").update({...form,data_saida:form.data_saida||null}).eq("id",editItem.id);
      if(error){show("Erro: "+error.message,"error");}else{setPayments(p=>p.map(x=>x.id===editItem.id?{...x,...form}:x));show("Atualizado!");}
    } else {
      const{data,error}=await sb.from("payments").insert({user_id:user.id,...form,data_saida:form.data_saida||null}).select().single();
      if(error){show("Erro: "+error.message,"error");}else{setPayments(p=>[data,...p]);show("Payment adicionada!");}
    }
    setSaving(false);setModal(false);setEditItem(null);setForm(emptyForm);
  };

  const del=async(id)=>{await sb.from("payments").delete().eq("id",id);setPayments(p=>p.filter(x=>x.id!==id));show("Removida");};

  const toggleStatus=async(p)=>{
    const next=p.status==="Aquecimento"?"Pronta":"Aquecimento";
    await sb.from("payments").update({status:next}).eq("id",p.id);
    setPayments(prev=>prev.map(x=>x.id===p.id?{...x,status:next}:x));
  };

  const fmt=d=>{if(!d)return null;const[y,m,dd]=d.slice(0,10).split("-");return`${dd}/${m}/${y}`;};
  const diasRestantes=(d)=>{if(!d)return null;return Math.ceil((new Date(d)-new Date())/(1000*60*60*24));};

  const filtered=payments.filter(p=>
    (filterStatus==="Todos"||p.status===filterStatus)&&
    ((p.nome||"").toLowerCase().includes(search.toLowerCase())||(p.loja||"").toLowerCase().includes(search.toLowerCase()))
  );
  const aquecimento=filtered.filter(p=>p.status==="Aquecimento");
  const prontas=filtered.filter(p=>p.status==="Pronta");

  const CardPay=({p})=>{
    const [hov,setHov]=useState(false);
    const dias=diasRestantes(p.data_saida);
    const urgente=dias!==null&&dias<=3&&dias>=0;
    const expirada=dias!==null&&dias<0;
    return (
      <div style={{background:C.surface,border:`0.5px solid ${expirada?"rgba(239,68,68,0.35)":hov?C.borderHover:C.border}`,borderRadius:14,padding:"16px 18px",transition:"all 0.15s"}} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:500,color:C.text,marginBottom:3}}>{p.nome}</div>
            {p.loja&&<div style={{fontSize:12,color:C.textMuted,display:"flex",alignItems:"center",gap:5}}><Icon name="store" size={11}/>{p.loja}</div>}
          </div>
          <span style={{fontSize:12,fontFamily:"'Geist Mono',monospace",padding:"3px 10px",borderRadius:6,background:cicloColorDim(p.ciclo),color:cicloColor(p.ciclo),fontWeight:600,flexShrink:0,marginLeft:10}}>{p.ciclo}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:p.notas?10:0}}>
          <button onClick={()=>toggleStatus(p)} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 11px",borderRadius:7,fontSize:12,fontFamily:"'Geist',sans-serif",fontWeight:500,cursor:"pointer",border:"none",background:p.status==="Pronta"?C.greenDim:C.amberDim,color:p.status==="Pronta"?C.green:C.amber,transition:"all 0.15s"}}>
            <Icon name={p.status==="Pronta"?"zap":"fire"} size={12}/>{p.status}
          </button>
          {p.data_saida&&(
            <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,fontFamily:"'Geist Mono',monospace",padding:"4px 9px",borderRadius:7,background:expirada?C.redDim:urgente?C.amberDim:"#1a1a1a",color:expirada?C.red:urgente?C.amber:C.textMuted}}>
              <Icon name="calendar" size={10}/>{fmt(p.data_saida)}
              {dias!==null&&<span style={{marginLeft:3}}>{expirada?"· expirada":dias===0?"· hoje":dias===1?"· amanhã":`· ${dias}d`}</span>}
            </div>
          )}
        </div>
        {p.notas&&<div style={{fontSize:11,color:C.textMuted,padding:"7px 10px",background:"#0d0d0d",borderRadius:7,lineHeight:1.5,marginTop:8}}>{p.notas}</div>}
        <div style={{display:"flex",justifyContent:"flex-end",gap:6,marginTop:12}}>
          <button onClick={()=>openEdit(p)} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",padding:4}}><Icon name="edit" size={13}/></button>
          <button onClick={()=>del(p.id)} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",padding:4}}><Icon name="trash" size={13}/></button>
        </div>
      </div>
    );
  };

  const Section=({title,items,color})=>(
    <div style={{marginBottom:32}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:color}}/>
        <span style={{fontSize:13,fontWeight:500,color,textTransform:"uppercase",letterSpacing:"0.05em"}}>{title}</span>
        <span style={{fontSize:11,color:C.textDim,marginLeft:4,fontFamily:"'Geist Mono',monospace"}}>{items.length}</span>
      </div>
      {items.length===0
        ?<div style={{padding:"20px",textAlign:"center",color:C.textDim,fontSize:13,border:`0.5px dashed ${C.border}`,borderRadius:12}}>Nenhuma payment neste status</div>
        :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>{items.map(p=><CardPay key={p.id} p={p}/>)}</div>
      }
    </div>
  );

  return (
    <div className="page-pad" style={{overflowY:"auto",flex:1}}>
      {El}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div><h1 style={{fontSize:22,fontWeight:600,color:C.text,letterSpacing:"-0.03em"}}>Payments</h1><p style={{fontSize:13,color:C.textMuted,marginTop:2}}>{payments.length} payments cadastradas</p></div>
        <Btn variant="primary" icon="plus" onClick={openNew}>Nova Payment</Btn>
      </div>

      <div className="grid-pay-4">
        {[
          {l:"Total",v:payments.length,c:C.accent},
          {l:"Aquecimento",v:payments.filter(p=>p.status==="Aquecimento").length,c:C.amber},
          {l:"Prontas",v:payments.filter(p=>p.status==="Pronta").length,c:C.green},
          {l:"Expirando em breve",v:payments.filter(p=>{const d=diasRestantes(p.data_saida);return d!==null&&d<=3&&d>=0;}).length,c:C.red},
        ].map((s,i)=><div key={i} style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:12,padding:"16px 18px"}}><div style={{fontSize:11,color:C.textMuted,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.l}</div><div style={{fontSize:28,fontWeight:600,color:s.c,letterSpacing:"-0.02em"}}>{s.v}</div></div>)}
      </div>

      <div style={{display:"flex",gap:10,marginBottom:20,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:1,maxWidth:320}}><span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.textMuted}}><Icon name="search" size={14}/></span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nome ou loja..." style={{width:"100%",background:C.surface,border:`0.5px solid ${C.border}`,color:C.text,fontFamily:"'Geist',sans-serif",fontSize:13,padding:"8px 12px 8px 32px",borderRadius:8,outline:"none"}}/></div>
        <div style={{display:"flex",gap:4}}>{["Todos","Aquecimento","Pronta"].map(s=><button key={s} onClick={()=>setFilterStatus(s)} style={{padding:"6px 14px",borderRadius:7,fontSize:12,fontFamily:"'Geist',sans-serif",fontWeight:500,cursor:"pointer",background:filterStatus===s?C.accentDim:"transparent",color:filterStatus===s?C.accent:C.textMuted,border:`0.5px solid ${filterStatus===s?C.accentBorder:C.border}`,transition:"all 0.15s"}}>{s}</button>)}</div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
        {ciclos.map(c=><div key={c} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:8,background:cicloColorDim(c),border:`0.5px solid ${cicloColor(c)}33`}}><Icon name="clock" size={11}/><span style={{fontSize:11,fontFamily:"'Geist Mono',monospace",fontWeight:600,color:cicloColor(c)}}>{c}</span><span style={{fontSize:11,color:cicloColor(c),opacity:0.7}}>{c==="D3"?"3 dias":c==="D5"?"5 dias":c==="D7"?"7 dias":"14 dias"}</span></div>)}
      </div>

      {loading?<div style={{textAlign:"center",padding:40}}><Spinner size={24}/></div>:(
        filterStatus==="Todos"?(
          <><Section title="Em aquecimento" items={aquecimento} color={C.amber}/><Section title="Prontas para uso" items={prontas} color={C.green}/></>
        ):(
          <Section title={filterStatus==="Aquecimento"?"Em aquecimento":"Prontas para uso"} items={filtered} color={filterStatus==="Aquecimento"?C.amber:C.green}/>
        )
      )}

      {modal&&(
        <Modal title={editItem?"Editar Payment":"Nova Payment"} onClose={()=>{setModal(false);setEditItem(null);}}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div><label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Nome da payment</label><Input value={form.nome} onChange={v=>setForm(p=>({...p,nome:v}))} placeholder="Ex: Nubank Principal, PagBank 2..."/></div>
            <div><label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Loja vinculada</label><Input value={form.loja} onChange={v=>setForm(p=>({...p,loja:v}))} placeholder="Ex: Loja A, Store B..."/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Status</label>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {["Aquecimento","Pronta"].map(s=>(
                    <button key={s} onClick={()=>setForm(p=>({...p,status:s}))} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderRadius:8,cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:13,fontWeight:form.status===s?500:400,background:form.status===s?(s==="Pronta"?C.greenDim:C.amberDim):"#0d0d0d",color:form.status===s?(s==="Pronta"?C.green:C.amber):C.textMuted,border:`0.5px solid ${form.status===s?(s==="Pronta"?"rgba(34,197,94,0.3)":"rgba(245,158,11,0.3)"):C.border}`,transition:"all 0.15s",textAlign:"left"}}>
                      <Icon name={s==="Pronta"?"zap":"fire"} size={13}/>{s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Ciclo de pagamento</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {ciclos.map(c=>(
                    <button key={c} onClick={()=>setForm(p=>({...p,ciclo:c}))} style={{padding:"9px 0",borderRadius:8,cursor:"pointer",fontFamily:"'Geist Mono',monospace",fontSize:13,fontWeight:600,background:form.ciclo===c?cicloColorDim(c):"#0d0d0d",color:form.ciclo===c?cicloColor(c):C.textMuted,border:`0.5px solid ${form.ciclo===c?cicloColor(c)+"44":C.border}`,transition:"all 0.15s",textAlign:"center"}}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div><label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Data de saída do aquecimento</label><Input type="date" value={form.data_saida} onChange={v=>setForm(p=>({...p,data_saida:v}))}/></div>
            <div><label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Observações</label><textarea value={form.notas} onChange={e=>setForm(p=>({...p,notas:e.target.value}))} placeholder="Limite, banco, observações..." rows={3} style={{background:"#0d0d0d",border:`0.5px solid ${C.border}`,color:C.text,fontFamily:"'Geist',sans-serif",fontSize:13,padding:"8px 12px",borderRadius:8,outline:"none",resize:"none",width:"100%"}} onFocus={e=>e.target.style.borderColor=C.accentBorder} onBlur={e=>e.target.style.borderColor=C.border}/></div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:4}}><Btn variant="outline" onClick={()=>{setModal(false);setEditItem(null);}}>Cancelar</Btn><Btn variant="primary" onClick={submit} loading={saving}>{editItem?"Salvar alterações":"Adicionar"}</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── LOJAS ────────────────────────────────────────────────────────────────────
const LojasPage=({sb,user})=>{
  const [lojas,setLojas]=useState([]);
  const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState(false);
  const [editItem,setEditItem]=useState(null);
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({nome:"",moeda:"BRL",notas:""});
  const {show,El}=useToast();
  const moedas=["BRL","USD","EUR","GBP"];
  const moedaSimbol={"BRL":"R$","USD":"US$","EUR":"€","GBP":"£"};

  useEffect(()=>{
    sb.from("lojas").select("*").eq("user_id",user.id).order("created_at",{ascending:false})
      .then(({data})=>{setLojas(data||[]);setLoading(false);});
  },[]);

  const openNew=()=>{setForm({nome:"",moeda:"BRL",notas:""});setEditItem(null);setModal(true);};
  const openEdit=(l)=>{setForm({nome:l.nome,moeda:l.moeda||"BRL",notas:l.notas||""});setEditItem(l);setModal(true);};

  const submit=async()=>{
    if(!form.nome.trim()){show("Nome é obrigatório","error");return;}
    setSaving(true);
    if(editItem){
      const{error}=await sb.from("lojas").update({nome:form.nome.trim(),moeda:form.moeda,notas:form.notas}).eq("id",editItem.id);
      if(error){show("Erro: "+error.message,"error");}
      else{setLojas(p=>p.map(l=>l.id===editItem.id?{...l,...form}:l));show("Loja atualizada!");}
    } else {
      const{data,error}=await sb.from("lojas").insert({user_id:user.id,nome:form.nome.trim(),moeda:form.moeda,notas:form.notas}).select().single();
      if(error){show("Erro: "+error.message,"error");}
      else{setLojas(p=>[data,...p]);show("Loja cadastrada!");}
    }
    setSaving(false);setModal(false);setEditItem(null);
  };

  const del=async(id)=>{
    await sb.from("lojas").delete().eq("id",id);
    setLojas(p=>p.filter(l=>l.id!==id));show("Loja removida");
  };

  return (
    <div className="page-pad" style={{overflowY:"auto",flex:1}}>
      {El}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:600,color:C.text,letterSpacing:"-0.03em"}}>Lojas</h1>
          <p style={{fontSize:13,color:C.textMuted,marginTop:2}}>{lojas.length} lojas cadastradas · usado para registrar lucros</p>
        </div>
        <Btn variant="primary" icon="plus" onClick={openNew}>Nova Loja</Btn>
      </div>

      {loading?<div style={{textAlign:"center",padding:40}}><Spinner size={24}/></div>:(
        lojas.length===0?(
          <div style={{textAlign:"center",padding:"60px 0",color:C.textDim}}>
            <Icon name="store" size={32}/>
            <div style={{fontSize:14,marginTop:12,marginBottom:6,color:C.textMuted}}>Nenhuma loja cadastrada ainda</div>
            <div style={{fontSize:12,color:C.textDim}}>Cadastre suas lojas para registrar lucros no painel</div>
            <button onClick={openNew} style={{marginTop:16,padding:"8px 20px",borderRadius:8,background:C.accent,color:"#fff",border:"none",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'Geist',sans-serif"}}>Cadastrar primeira loja</button>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
            {lojas.map(l=>(
              <div key={l.id} style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:14,padding:"20px 20px",transition:"border-color 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderHover}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:40,height:40,borderRadius:10,background:C.amberDim,display:"flex",alignItems:"center",justifyContent:"center",color:C.amber}}>
                      <Icon name="store" size={18}/>
                    </div>
                    <div>
                      <div style={{fontSize:15,fontWeight:600,color:C.text}}>{l.nome}</div>
                      <div style={{fontSize:11,color:C.textMuted,marginTop:2,fontFamily:"'Geist Mono',monospace"}}>
                        {moedaSimbol[l.moeda]||""} {l.moeda}
                      </div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={()=>openEdit(l)} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",padding:6,borderRadius:6,transition:"color 0.15s"}}
                      onMouseEnter={e=>e.currentTarget.style.color=C.text} onMouseLeave={e=>e.currentTarget.style.color=C.textDim}>
                      <Icon name="edit" size={14}/>
                    </button>
                    <button onClick={()=>del(l.id)} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",padding:6,borderRadius:6,transition:"color 0.15s"}}
                      onMouseEnter={e=>e.currentTarget.style.color=C.red} onMouseLeave={e=>e.currentTarget.style.color=C.textDim}>
                      <Icon name="trash" size={14}/>
                    </button>
                  </div>
                </div>
                {l.notas&&<div style={{fontSize:12,color:C.textMuted,padding:"8px 10px",background:"#0d0d0d",borderRadius:7,lineHeight:1.5}}>{l.notas}</div>}
                <div style={{fontSize:10,color:C.textDim,marginTop:10,fontFamily:"'Geist Mono',monospace"}}>cadastrada em {l.created_at?.slice(0,10)}</div>
              </div>
            ))}
          </div>
        )
      )}

      {modal&&(
        <Modal title={editItem?"Editar Loja":"Nova Loja"} onClose={()=>{setModal(false);setEditItem(null);}}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Nome da loja</label>
              <Input value={form.nome} onChange={v=>setForm(p=>({...p,nome:v}))} placeholder="Ex: NordicCamp, Loja A, Store B..."/>
            </div>
            <div>
              <label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Moeda padrão</label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {moedas.map(m=>(
                  <button key={m} onClick={()=>setForm(p=>({...p,moeda:m}))} style={{padding:"9px 0",borderRadius:8,cursor:"pointer",fontFamily:"'Geist Mono',monospace",fontSize:13,fontWeight:600,textAlign:"center",background:form.moeda===m?C.accentDim:"#0d0d0d",color:form.moeda===m?C.accent:C.textMuted,border:`0.5px solid ${form.moeda===m?C.accentBorder:C.border}`,transition:"all 0.15s"}}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Observações</label>
              <textarea value={form.notas} onChange={e=>setForm(p=>({...p,notas:e.target.value}))} placeholder="Nicho, plataforma, observações..." rows={3} style={{background:"#0d0d0d",border:`0.5px solid ${C.border}`,color:C.text,fontFamily:"'Geist',sans-serif",fontSize:13,padding:"8px 12px",borderRadius:8,outline:"none",resize:"none",width:"100%"}}
                onFocus={e=>e.target.style.borderColor=C.accentBorder} onBlur={e=>e.target.style.borderColor=C.border}/>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:4}}>
              <Btn variant="outline" onClick={()=>{setModal(false);setEditItem(null);}}>Cancelar</Btn>
              <Btn variant="primary" onClick={submit} loading={saving}>{editItem?"Salvar":"Cadastrar Loja"}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const sb=supabaseClient;
  const [user,setUser]=useState(undefined); // undefined=carregando, null=sem sessão
  const [page,setPage]=useState("dashboard");
  const [storeName,setStoreName]=useState("Minha Loja");

  useEffect(()=>{
    sb.auth.getSession().then(({data:{session}})=>setUser(session?.user??null));
    const{data:{subscription}}=sb.auth.onAuthStateChange((_,session)=>setUser(session?.user??null));
    return ()=>subscription.unsubscribe();
  },[]);

  // Carregando sessão
  if(user===undefined) return(
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg,flexDirection:"column",gap:12,color:C.textMuted}}>
        <Spinner size={32}/><div style={{fontSize:13}}>Carregando...</div>
      </div>
    </>
  );

  // Não autenticado
  if(!user) return <LoginPage sb={sb}/>;

  const pages={
    dashboard:<PainelPage sb={sb} user={user} setPage={setPage}/>,
    links:<LinksPage sb={sb} user={user}/>,
    tarefas:<TarefasPage sb={sb} user={user}/>,
    arquivos:<ArquivosPage sb={sb} user={user}/>,
    payments:<PaymentsPage sb={sb} user={user}/>,
    lojas:<LojasPage sb={sb} user={user}/>,
  };

  return (
    <>
      <style>{css}</style>
      <div style={{display:"flex",height:"100vh",overflow:"hidden",background:C.bg}}>
        <div className="sidebar" style={{flexDirection:"column"}}>
          <Sidebar page={page} setPage={setPage} storeName={storeName} setStoreName={setStoreName} sb={sb} user={user}/>
        </div>
        <main style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div className="main-topbar" style={{borderBottom:`0.5px solid ${C.border}`,padding:"11px 36px",display:"flex",alignItems:"center",justifyContent:"space-between",background:C.bg,flexShrink:0}}>
            <div className="topbar-date" style={{fontSize:12,color:C.textMuted,fontFamily:"'Geist Mono',monospace"}}>{new Date().toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
            <div style={{fontSize:11,padding:"3px 10px",borderRadius:6,background:C.greenDim,color:C.green,border:"0.5px solid rgba(34,197,94,0.3)",fontFamily:"'Geist Mono',monospace"}}>● online</div>
          </div>
          {pages[page]}
        </main>
      </div>
      <BottomNav page={page} setPage={setPage} sb={sb}/>
    </>
  );
}
