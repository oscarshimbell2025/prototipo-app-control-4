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
    content.appendChild(createButtons(closeModal,()=>{
      localStorage.setItem('maquinaDesc',desc.value);
      if(file.files.length>0){
        const readers=[];
        for(const f of file.files){
          const r=new FileReader();
          readers.push(new Promise(res=>{r.onload=e=>res(e.target.result);r.readAsDataURL(f);}));
        }
        Promise.all(readers).then(images=>{
          const all=existing.concat(images);
          localStorage.setItem('maquinaFotos',JSON.stringify(all));
          displayAllPhotos();
        });
      } else {
        displayAllPhotos();
      }
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
    content.appendChild(createButtons(closeModal,()=>{
      if(file.files.length>0){
        const readers=[];
        for(const f of file.files){
          const r=new FileReader();
          readers.push(new Promise(res=>{r.onload=e=>res(e.target.result);r.readAsDataURL(f);}));
        }
        Promise.all(readers).then(images=>{
          const existing=JSON.parse(localStorage.getItem('extraFotos')||'[]');
          const all=existing.concat(images);
          localStorage.setItem('extraFotos',JSON.stringify(all));
          displayAllPhotos();
        });
      }
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
  all.forEach(src=>{
    const img=document.createElement('img');
    img.src=src;
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

