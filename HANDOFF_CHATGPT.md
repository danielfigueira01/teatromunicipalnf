# 🎭 MANUAL DE CONTINUIDADE E ATUALIZAÇÃO DO SITE
## Teatro Municipal Laércio Rangel Ventura — Nova Friburgo, RJ

> **Documento de Contexto e Handoff Técnico**  
> Criado para dar continuidade à manutenção e evolução do site via **ChatGPT**, **Codex**, **Claude** ou qualquer outra IA/desenvolvedor.

---

## 1. 📌 INFORMAÇÕES GERAIS DO PROJETO

* **Nome do Projeto:** Site Oficial do Teatro Municipal Laércio Rangel Ventura
* **Município:** Nova Friburgo – RJ
* **Domínio Oficial de Produção:** [https://teatromunicipalnf.com.br](https://teatromunicipalnf.com.br)
* **Domínio Provisório / Fallback:** [https://danielfigueira01.github.io/teatromunicipalnf/](https://danielfigueira01.github.io/teatromunicipalnf/)
* **Usuário GitHub:** `danielfigueira01`
* **Repositório de Publicação (Deploy):** [github.com/danielfigueira01/teatromunicipalnf](https://github.com/danielfigueira01/teatromunicipalnf)
* **Repositório do Código-Fonte React (Base):** [github.com/danielfigueira01/friburgo-stagecraft](https://github.com/danielfigueira01/friburgo-stagecraft)
* **Pastas Locais no Computador:**
  * **Pasta do Deploy (ativa):** `C:\Users\User\Documents\teatromunicipalnf`
  * **Pasta do Código-Fonte React:** `C:\Users\User\Documents\teatromunicipalnf_source`

---

## 2. 🏗️ ARQUITETURA E HOSPEDAGEM

* **Frontend:** React 18, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Lucide Icons, Date-fns.
* **Hospedagem:** **GitHub Pages** (gratuito, sem necessidade de servidores externos como HostGator).
  * O GitHub Pages compila/serve os arquivos estáticos diretamente do branch `main`.
* **DNS (Registro.br):**
  * O domínio utiliza os servidores autoritativos gratuitos do próprio **Registro.br**.
  * **Registros Tipo A** apontando para os 4 IPs oficiais do GitHub Pages:
    * `185.199.108.153`
    * `185.199.109.153`
    * `185.199.110.153`
    * `185.199.111.153`
  * **Registro CNAME** do `www` apontando para `danielfigueira01.github.io.`.
* **SSL / HTTPS:** Certificado Let's Encrypt gerado e renovado automaticamente pelo GitHub Pages com `Enforce HTTPS` ativado.
* **Compatibilidade SPA:** O repositório contém um arquivo `404.html` (cópia do `index.html`) e a variável `window.__BP` para garantir que o roteamento do React Router funcione sem erros 404 em recarregamento de página.

---

## 3. 📁 ESTRUTURA DOS ARQUIVOS

### Pasta do Deploy (`C:\Users\User\Documents\teatromunicipalnf`):
```text
teatromunicipalnf/
├── CNAME                  # Define o domínio customizado (teatromunicipalnf.com.br)
├── .nojekyll              # Evita que o GitHub Pages ignore arquivos com underline/assets
├── index.html             # Ponto de entrada com script de base path e meta tags SEO/OG
├── 404.html               # Redirecionamento SPA para rotas internas
├── favicon.ico / .png     # Ícones do Teatro Municipal
├── robots.txt             # Instruções para motores de busca
└── assets/                # Imagens dos espetáculos, logos, CSS e JS compilados
    ├── index-BcDX2Fb7.js  # Bundle principal da aplicação React
    ├── index-Duj_apHr.css # Estilos Tailwind e tema visual
    ├── hero-theater-*.jpg # Foto oficial do Teatro Municipal
    ├── teatro-logo-*.png  # Brasão e logotipo oficial do teatro
    ├── event-agora-e-que-sao-elas.jpg
    ├── event-travessia-encantada.jpg
    ├── event-tributo-porteno.jpg
    ├── event-trilhas-geek.jpg
    └── event-vivaldi.jpg
```

---

## 4. 🎟️ PROGRAMAÇÃO ATUAL DE ESPETÁCULOS (NOVEMBRO 2026)

Os espetáculos cadastrados atualmente no site contam com links diretos da **Sympla / Bileto**:

1. **08/11 às 15:00** — *Trilhas de Harry Potter, Senhor dos Anéis e Game of Thrones*
   * Tipo: Particular | Categoria: Música | Produtor: Multiply Produções
   * Ingresso: [Link Sympla](https://www.sympla.com.br/evento/trilhas-de-game-of-thrones-senhor-dos-aneis-e-harry-potter-a-luz-de-velas-nova-friburgo-08-11/3584608)
2. **08/11 às 17:00** — *Vivaldi: As Quatro Estações à Luz de Velas*
   * Tipo: Particular | Categoria: Música | Produtor: Multiply Produções
   * Ingresso: [Link Sympla](https://www.sympla.com.br/evento/vivaldi-as-4-estacoes-a-luz-de-velas-nova-friburgo-08-11/3584607)
3. **08/11 às 19:00** — *Tributo Porteño: De Gardel a Piazzolla*
   * Tipo: Particular | Categoria: Música / Dança | Produtor: Multiply Produções
   * Ingresso: [Link Sympla](https://www.sympla.com.br/evento/tributo-porteno-de-gardel-a-piazzolla-nova-friburgo-rj-08-11/3614730)
4. **14/11 às 21:00** — *Agora É Que São Elas!* (Fábio Porchat, Júlia Rabello, Maria Clara Gueiros e Priscila Castello Branco)
   * Tipo: Particular | Categoria: Teatro / Comédia | Produtor: Semente Cultural
   * Ingresso: [Link Sympla Bileto](https://bileto.sympla.com.br/event/125938)
5. **22/11 às 17:30** — *A Travessia Encantada — A Fenda* (Carol Moryc)
   * Tipo: Prefeitura | Categoria: Infantil | Produtor: Avante Casting / Sec. Cultura
   * Ingresso: **Entrada Gratuita**

---

## 5. 🛠️ GUIA PASSO A PASSO PARA O CHATGPT / DESENVOLVEDOR

### Como adicionar um novo espetáculo:

1. **Salvar a Imagem:**
   * Coloque o cartaz do evento em formato `.jpg` ou `.png` dentro de:  
     `C:\Users\User\Documents\teatromunicipalnf\assets\event-nome-do-evento.jpg`

2. **Estrutura de Dados do Evento:**
   Cada evento segue o formato abaixo:
   ```json
   {
     "id": "106",
     "titulo": "Nome do Espetáculo",
     "imagem": "event-nome-do-evento",
     "data": "2026-11-30",
     "horario": "20:00",
     "classificacao": "Livre",
     "duracao": "1h30",
     "produtor": "Nome da Produtora",
     "categoria": "Teatro",
     "linkIngresso": "https://sympla.com.br/...",
     "descricao": "Sinopse completa do evento...",
     "mes": "2026-11",
     "tipo": "particular"
   }
   ```
   *Categorias aceitas:* `"Música"`, `"Teatro"`, `"Dança"`, `"Infantil"`, `"Stand-up"`, `"Eventos Escolares"`.  
   *Tipos aceitos:* `"particular"` ou `"prefeitura"`.

3. **Atualizar no Código-Fonte:**
   * Atualize o arquivo `C:\Users\User\Documents\teatromunicipalnf_source\src\data\mockData.ts` inserindo o novo evento no topo da lista `export const eventos: Evento[] = [...]`.

4. **Publicar no Site Oficial (Git Push):**
   Abra o terminal (PowerShell ou Bash) na pasta de deploy:
   ```bash
   cd "C:\Users\User\Documents\teatromunicipalnf"
   git add .
   git commit -m "Adicionar novo espetaculo"
   git push origin main
   ```
   *Após o push, o GitHub Pages compila e atualiza o site no ar automaticamente em cerca de 20 a 30 segundos!*

---

## 6. 🔗 LINKS E RECURSOS ÚTEIS

* **Site Oficial:** [https://teatromunicipalnf.com.br](https://teatromunicipalnf.com.br)
* **Repositório GitHub Pages:** [https://github.com/danielfigueira01/teatromunicipalnf](https://github.com/danielfigueira01/teatromunicipalnf)
* **Status do GitHub Pages:** [Configurações do Repositório](https://github.com/danielfigueira01/teatromunicipalnf/settings/pages)
* **Painel Registro.br:** [https://registro.br/painel/](https://registro.br/painel/)
* **Instagram Oficial:** [@teatromunicipalnf](https://www.instagram.com/teatromunicipalnf/) e [@culturanf](https://www.instagram.com/culturanf/)

---

## 7. Atualização visual da página inicial — novembro de 2026

* **Implementação:** a home passou a ser uma página HTML/CSS/JavaScript independente, preservando os arquivos React existentes para as páginas institucionais.
* **Arquivos alterados:** `index.html` e `404.html`; adicionados `programacao/index.html` e `agenda/index.html` para encaminhar à seção `/#programacao`.
* **Recursos preservados:** `CNAME`, `.nojekyll`, favicons e todo o conteúdo existente de `assets/`.
* **Recursos usados pela nova home:** `event-vivaldi.jpg`, `event-trilhas-geek.jpg`, `event-tributo-porteno.jpg`, `event-agora-e-que-sao-elas.jpg`, `event-travessia-encantada.jpg`, `hero-theater-BQCT0Xtm.jpg` e `teatro-logo-branco-C_85Q_MG.png`.
* **Referência para reversão:** `331553eebeb1fee10521eba40c9189caab2bf18d` (estado anterior da publicação).
* **Validação realizada:** sintaxe do JavaScript da home, existência dos recursos referenciados, destaques selecionáveis, detalhes de evento, menu móvel e os redirecionamentos de programação/agenda. O GitHub Pages publicou com sucesso o commit visual `f96245cf4dab884a9df0972c6942b94a19784997`; o domínio oficial foi conferido após a publicação.

---

## 8. Painel de programação

* **Endereço:** `https://teatromunicipalnf.com.br/admin/`.
* **Acesso:** somente a conta `danielfigueira01@gmail.com` pode criar sessão e alterar a programação.
* **Como usar:** no primeiro acesso, informe esse e-mail, escolha uma senha de ao menos oito caracteres e clique em **Criar acesso**. Confirme o e-mail recebido pelo Supabase; depois, entre normalmente.
* **O que o painel faz:** cria, edita, publica/despublica, exclui e organiza até três destaques da abertura. Também aceita cartazes JPG, PNG ou WebP de até 5 MB.
* **Dados e segurança:** a programação está no projeto Supabase `Teatro Municipal NF` (região São Paulo). A página pública só lê eventos publicados; as permissões de inserção, alteração, exclusão e arquivos de cartaz são protegidas por RLS no banco, além da verificação de e-mail no painel.
* **Arquivos da integração:** `assets/teatro-supabase.js` concentra a configuração pública do cliente; `assets/theater-data.js` atualiza a home automaticamente; `assets/admin.js` controla o painel.
