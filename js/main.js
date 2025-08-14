function login(event) {
  event.preventDefault();
  window.location.href = 'pantalla2.html';
}

function $(id){return document.getElementById(id);}

function openModal(builder){
  const modal=$('modal');
  const content=$('modal-content');
  content.innerHTML='';
  builder(content);
  modal.classList.remove('hidden');
}

function closeModal(){
  $('modal').classList.add('hidden');
}

function createButtons(onCancel,onSave){
  const wrapper=document.createElement('div');
  const cancel=document.createElement('button');
  cancel.textContent='Cancelar';
  cancel.onclick=onCancel;
  const save=document.createElement('button');
  save.textContent='Guardar';
  save.onclick=onSave;
  wrapper.appendChild(cancel);
  wrapper.appendChild(save);
  return wrapper;
}

function openClima(){
  openModal(content=>{
    const textarea=document.createElement('textarea');
    textarea.value=localStorage.getItem('clima')||'';
    content.appendChild(textarea);
    content.appendChild(createButtons(closeModal,()=>{
      localStorage.setItem('clima',textarea.value);
      alert('guardado con éxito');
      closeModal();
    }));
  });
}

function openPersonal(){
  openModal(content=>{
    const num=document.createElement('input');
    num.type='number';
    num.value=localStorage.getItem('personalCantidad')||'';
    const obs=document.createElement('textarea');
    obs.placeholder='Observaciones';
    obs.value=localStorage.getItem('personalObs')||'';
    content.appendChild(num);
    content.appendChild(obs);
    content.appendChild(createButtons(closeModal,()=>{
      localStorage.setItem('personalCantidad',num.value);
      localStorage.setItem('personalObs',obs.value);
      alert('guardado con éxito');
      if($('personal-info')) $('personal-info').textContent='Personal presente: '+num.value;
      closeModal();
    }));
  });
}

function openMaquina(){
  openModal(content=>{
    const desc=document.createElement('textarea');
    desc.placeholder='Descripción de la máquina';
    desc.value=localStorage.getItem('maquinaDesc')||'';
    const file=document.createElement('input');
    file.type='file';
    file.accept='image/*';
    file.multiple=true;
    content.appendChild(desc);
    content.appendChild(file);
    const existing=JSON.parse(localStorage.getItem('maquinaFotos')||'[]');
    existing.forEach(src=>{
      const img=document.createElement('img');
      img.src=src; img.style.width='60px'; img.style.marginRight='5px';
      content.appendChild(img);
    });
    content.appendChild(createButtons(closeModal, async ()=>{
      localStorage.setItem('maquinaDesc',desc.value);
      let urls=[];
      if(file.files.length>0){
        const form=new FormData();
        for(const f of file.files) form.append('files',f);
        try{
          const res=await fetch('/upload',{method:'POST',body:form});
          const data=await res.json();
          urls=data.urls||[];
        }catch(err){
          console.error('Error subiendo archivos',err);
        }
      }
      const all=existing.concat(urls);
      localStorage.setItem('maquinaFotos',JSON.stringify(all));
      displayAllPhotos();
      alert('guardado con éxito');
      closeModal();
    }));
  });
}

function openAvance(){
  openModal(content=>{
    const input=document.createElement('input');
    input.type='number';
    input.placeholder='%';
    input.value=localStorage.getItem('avance')||'';
    content.appendChild(input);
    content.appendChild(createButtons(closeModal,()=>{
      localStorage.setItem('avance',input.value);
      alert('guardado con éxito');
      if($('avance-info')) $('avance-info').textContent='Avance físico: '+input.value+'%';
      closeModal();
    }));
  });
}

function openInstrucciones(){
  window.open('instrucciones.pdf','_blank');
}

function openVientos(){
  openModal(content=>{
    const textarea=document.createElement('textarea');
    textarea.placeholder='Descripción';
    textarea.value=localStorage.getItem('vientos')||'';
    content.appendChild(textarea);
    content.appendChild(createButtons(closeModal,()=>{
      localStorage.setItem('vientos',textarea.value);
      alert('guardado con éxito');
      closeModal();
    }));
  });
}

function openFotos(){
  openModal(content=>{
    const file=document.createElement('input');
    file.type='file';
    file.accept='image/*';
    file.capture='environment';
    file.multiple=true;
    content.appendChild(file);
    content.appendChild(createButtons(closeModal, async ()=>{
      let urls=[];
      if(file.files.length>0){
        const form=new FormData();
        for(const f of file.files) form.append('files',f);
        try{
          const res=await fetch('/upload',{method:'POST',body:form});
          const data=await res.json();
          urls=data.urls||[];
        }catch(err){
          console.error('Error subiendo archivos',err);
        }
      }
      const existing=JSON.parse(localStorage.getItem('extraFotos')||'[]');
      const all=existing.concat(urls);
      localStorage.setItem('extraFotos',JSON.stringify(all));
      displayAllPhotos();
      alert('guardado con éxito');
      closeModal();
    }));
  });
}

function displayAllPhotos(){
  const container=$('fotos-container');
  if(!container) return;
  container.innerHTML='';
  const all=[...JSON.parse(localStorage.getItem('maquinaFotos')||'[]'),
             ...JSON.parse(localStorage.getItem('extraFotos')||'[]')];
  all.forEach(url=>{
    const img=document.createElement('img');
    img.src=url;
    container.appendChild(img);
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if ($('personal-info')) {
      const c = localStorage.getItem('personalCantidad');
      if (c) $('personal-info').textContent = 'Personal presente: ' + c;
    }
    if ($('avance-info')) {
      const a = localStorage.getItem('avance');
      if (a) $('avance-info').textContent = 'Avance físico: ' + a + '%';
    }
    displayAllPhotos();
  });
}

function generatePantalla5PDF(){
  const { jsPDF } = window.jspdf || {};
  if(!jsPDF){
    alert('jsPDF no disponible');
    return;
  }
  const doc = new jsPDF();
  let y = 10;
  const clima = localStorage.getItem('clima');
  if (clima) { doc.text('Clima: ' + clima, 10, y); y += 10; }
  const personal = localStorage.getItem('personalCantidad');
  if (personal) { doc.text('Personal: ' + personal, 10, y); y += 10; }
  const avance = localStorage.getItem('avance');
  if (avance) { doc.text('Avance físico: ' + avance + '%', 10, y); y += 10; }
  const vientos = localStorage.getItem('vientos');
  if (vientos) { doc.text('Vientos: ' + vientos, 10, y); y += 10; }
  const maquinaDesc = localStorage.getItem('maquinaDesc');
  if (maquinaDesc) { doc.text('Maquinaria: ' + maquinaDesc, 10, y); y += 10; }
  const imgs=[...JSON.parse(localStorage.getItem('maquinaFotos')||'[]'),
              ...JSON.parse(localStorage.getItem('extraFotos')||'[]')];
  imgs.forEach(src=>{
    if (y > 270) { doc.addPage(); y = 10; }
    try {
      doc.addImage(src, 'JPEG', 10, y, 180, 100);
      y += 105;
    } catch(e) {
      console.error('No se pudo agregar la imagen al PDF', e);
    }
  });
  const dataUri = doc.output('datauristring');
  localStorage.setItem('pantalla5pdf', dataUri);
  alert('Informe generado');
}

function exportPantalla5PDF(){
  const data = localStorage.getItem('pantalla5pdf');
  if(!data){
    alert('No hay informe generado');
    return;
  }
  const link=document.createElement('a');
  link.href=data;
  link.download='informe.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  alert('PDF exportado');
  localStorage.removeItem('pantalla5pdf');
}

