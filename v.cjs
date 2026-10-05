const fs=require("fs"),crypto=require("crypto");
const h=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const req={
 "src/shaders/spark-badge/SparkBadge.tsx":"2968baef448957765473ccd031f4337d376dbace5e8ec5434d0a57299ffecdda",
 "src/shaders/spark-badge/spark-badge.html":"a8eefdee0d87deefae9b8b8dac4d79c0ee41447578a78090cad9c956e33ccf90",
 "src/shaders/threeui.css":"efe4447139f1358dd8e9be68edf6fa46cbefbd1de423a4d6c439ca61d2c8eccf",
};
console.log("POST-EDIT SOURCE INTEGRITY (must still match registered hashes)");
for(const [p,exp] of Object.entries(req)){
  const got=h(p);
  console.log((got===exp?"  PASS  ":"  FAIL  ")+p);
}
console.log((h("public/spark-badge.html")===req["src/shaders/spark-badge/spark-badge.html"]?"  PASS  ":"  FAIL  ")+"public/spark-badge.html");
const css=fs.readFileSync("src/index.css");
console.log("\nindex.css BOM check (should be no BOM):", css[0]===0xEF?"BOM PRESENT":"clean");
