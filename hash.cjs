const fs=require('fs'),crypto=require('crypto');
const html=fs.readFileSync('public/spark-badge.html','utf8');
const re=/<script>([\s\S]*?)<\/script>/g; let m,i=0;
while((m=re.exec(html))){i++;
  const h=crypto.createHash('sha256').update(m[1],'utf8').digest('base64');
  console.log('script#'+i+' len='+m[1].length+' sha256-'+h);
}
console.log('total inline scripts:',i);
console.log('inline event handlers (on*=):',(html.match(/\son[a-z]+\s*=/gi)||[]).length);
