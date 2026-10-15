import { optimizeImage, MAX_UPLOAD_IMAGE_BYTES } from '../src/utils/images';
const button=document.querySelector<HTMLButtonElement>('#run')!;
button.onclick=async()=>{
  button.disabled=true;
  const results=document.querySelector('#results')!;results.textContent='Running…';
  const messages:string[]=[];
  const check=(condition:boolean,message:string)=>{if(!condition)throw new Error(message);messages.push(`PASS: ${message}`);results.textContent=messages.join('\n');};
  try {
    const canvas=document.createElement('canvas');canvas.width=2400;canvas.height=1800;
    const ctx=canvas.getContext('2d')!;const pixels=ctx.createImageData(canvas.width,canvas.height);
    // Deterministic high-detail source exercises actual browser compression.
    let seed=73;for(let i=0;i<pixels.data.length;i+=4){seed=(Math.imul(seed,1664525)+1013904223)>>>0;pixels.data[i]=seed&255;pixels.data[i+1]=(seed>>>8)&255;pixels.data[i+2]=(seed>>>16)&255;pixels.data[i+3]=255;}ctx.putImageData(pixels,0,0);
    const png=await new Promise<Blob>(resolve=>canvas.toBlob(blob=>resolve(blob!),'image/png'));
    const output=await optimizeImage(new File([png],'noise.png',{type:'image/png'}));
    const header=new TextDecoder().decode((await output.arrayBuffer()).slice(0,12));
    check(output.type==='image/webp' && header.startsWith('RIFF') && header.endsWith('WEBP'),'Encoded bytes are real WebP');
    check(output.size<=MAX_UPLOAD_IMAGE_BYTES,'Detailed photo fits the 1.5 MB bucket cap');
    const bitmap=await createImageBitmap(output);check(bitmap.width<=1600 && bitmap.height<=1600,'Output dimensions are limited to 1600 px');bitmap.close();
    document.querySelector<HTMLImageElement>('#preview')!.src=URL.createObjectURL(output);
    canvas.width=40;canvas.height=20;ctx.fillStyle='#b43835';ctx.fillRect(0,0,40,20);
    const jpeg=await new Promise<Blob>(resolve=>canvas.toBlob(blob=>resolve(blob!),'image/jpeg'));
    const large=new File([jpeg,new Uint8Array(16*1024*1024)],'large.jpg',{type:'image/jpeg'});
    const compressed=await optimizeImage(large);check(compressed.type==='image/webp' && compressed.size<=MAX_UPLOAD_IMAGE_BYTES,'Photo over the old 15 MB cap converts successfully');
    const typedBitmap=window.createImageBitmap;
    try{window.createImageBitmap=undefined as never;const fallback=await optimizeImage(new File([jpeg],'fallback.jpg',{type:'image/jpeg'}));check(fallback.type==='image/webp','Image-element fallback works without createImageBitmap');}finally{window.createImageBitmap=typedBitmap;}
    let failed=false;try{await optimizeImage(new File(['invalid'],'broken.png',{type:'image/png'}));}catch{failed=true;}check(failed,'Corrupt photo produces a readable error');
    results.textContent += '\nAll browser checks passed.';
  }catch(error){results.textContent+=`\nFAIL: ${error instanceof Error?error.message:String(error)}`;}finally{button.disabled=false;}
};
