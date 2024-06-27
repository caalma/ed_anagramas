class EdAnagram {
    html = `
<p class="titulo">Editor simple para
   <a href="https://es.wikipedia.org/wiki/Anagrama" target="_blank">ANAGRAMAS</a>
</p>
<div class="textos">
   <p class="nota">
      <small>Escribir el texto inicial aquí.</small>
   </p>
   <div class="grp">
      <textarea name="tex_a" class="tex pri" title="Entrada Principal"
        autocomplete="off" spellcheck="false" autocorrect="off" autocapitalize="off" translate="no"
        ></textarea>
   </div>
   <div class="grp">
      <textarea name="tex_b" class="tex seg" title="Edición texto 1"
        autocomplete="off" spellcheck="false" autocorrect="off" autocapitalize="off" translate="no"
        ></textarea>
   </div>
   <p class="nota">
      <small>Seleccionar parte del texto y presionado <b>Alt+FlechaIzquierda</b> o <b>Alt+FlechaDerecha</b> moverlo para reubicarlo.</small>
   </p>
</div>
<div class="menu">
   <button name="copiar" class="btn">COPIAR</button>
   <button name="limpiar" class="btn">LIMPIAR</button>
</div>
`;
    cDisc = 'discrepan';

    constructor (id_elem){
        this.el = document.getElementById(id_elem);
        this.el.classList.add('edanagram');
        this.el.innerHTML = this.html;
        this.tex_a = this.el.querySelector('[name=tex_a]');
        this.tex_b = this.el.querySelector('[name=tex_b]');
        this.btn_copiar = this.el.querySelector('[name=copiar]');
        this.btn_limpiar = this.el.querySelector('[name=limpiar]');
        this.incluir_en_el_entorno();
        this.setear_eventos();
        return this;
    }



    incluir_en_el_entorno() {
        if(window.edanagram_editores === undefined){
            window.edanagram_editores = [];
        }
        window.edanagram_editores.push(this);
    }

    setear_eventos() {
        this.tex_a.addEventListener('keyup', ()=>{
            this.tex_b.value = this.tex_a.value;
            this.verificar_discrepancia();

        });

        this.tex_b.addEventListener('keyup', ev=>{
            if(ev.altKey){
                this.mover_signo(ev.key);
                ev.preventDefault();
            }
            this.verificar_discrepancia();
        });



        this.btn_copiar.addEventListener('click', ()=>{
            this.enviar_al_portapapeles();
            this.informar_en_btn(this.btn_copiar, '# >> | |');
        });

        this.btn_limpiar.addEventListener('click', ()=>{
            this.limpiar_textos();
            this.informar_en_btn(this.btn_limpiar, '¡ (-_-) !');
        });
    }

    enviar_al_portapapeles() {
        let s = '---';
        let t = [
            s,
            this.tex_a.value, s,
            this.tex_b.value, s,
        ].join('\n');
        navigator.clipboard.writeText(t);
    }

    limpiar_textos() {
        let t = '';
        this.tex_a.value = t;
        this.tex_b.value = t;
    }

    informar_en_btn(e, t) {
        let o = e.innerHTML;
        e.innerHTML = t;
        setTimeout(()=>{ e.innerHTML = o }, 600);
    }

    verificar_discrepancia() {
        let signos_a = [...this.tex_a.value].sort().join('').trim();
        let signos_b = [...this.tex_b.value].sort().join('').trim();
        if(signos_a !== signos_b){
            this.el.classList.add(this.cDisc);
        }else{
            this.el.classList.remove(this.cDisc);
        }
    }

    mover_signo(k) {
        let pi = this.tex_b.selectionStart,
            pf = this.tex_b.selectionEnd,
            tex = this.tex_b.value,
            tsel = tex.substring(pi, pf),
            san = tex.substring(pi-1, pi),
            spo = tex.substring(pf, pf+1),
            tsi = tex.substring(0, pi-1),
            tsf = tex.substring(pf+1, tex.length);

        let m = {
            'ArrowLeft': () => {
                this.tex_b.value = [tsi, tsel, san,  spo, tsf].join('');
                this.tex_b.selectionStart = pi - 1;
                this.tex_b.selectionEnd = pf - 1;
            },
            'ArrowRight': () => {
                this.tex_b.value = [tsi, san, spo, tsel, tsf].join('');
                this.tex_b.selectionStart = pi + 1;
                this.tex_b.selectionEnd = pf + 1;
            },
        }

        if(k in m){
            m[k]();
        }
    }
}
