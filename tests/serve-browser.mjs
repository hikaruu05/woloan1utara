// Isolated visual fixture: the alias uses in-memory accounts instead of Supabase.
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
const uploads=new Map();
const server=await createServer({
  server:{host:'127.0.0.1',port:5180,strictPort:true},
  plugins:[{
    name:'isolated-dashboard-fixture',enforce:'pre',
    resolveId(id){if(/(?:^|\/)services\/supabase(?:\.ts)?$/.test(id))return fileURLToPath(new URL('./browser-api.ts',import.meta.url));},
    configureServer(server){server.middlewares.use('/__test-uploads',async(req,res,next)=>{
      if(req.method==='POST'){const chunks=[];for await(const chunk of req)chunks.push(chunk);const id=`/${crypto.randomUUID()}.webp`;uploads.set(id,Buffer.concat(chunks));res.setHeader('Content-Type','application/json');res.end(JSON.stringify({url:`http://127.0.0.1:5180/__test-uploads${id}`}));}
      else if(uploads.has(req.url)){res.setHeader('Content-Type','image/webp');res.end(uploads.get(req.url));}else next();
    });}
  }],
});
await server.listen();console.log('Isolated fixture: http://127.0.0.1:5180/tests/browser.html');
