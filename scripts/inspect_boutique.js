const fs = require('fs');
const path = require('path');

const boutiqueDir = path.join(process.cwd(), 'Kendji Boutique');
const publicDir = path.join(process.cwd(), 'public', 'products');

const folders = fs.readdirSync(boutiqueDir).filter(f => fs.statSync(path.join(boutiqueDir, f)).isDirectory());

console.log('=== KENDJI BOUTIQUE FOLDER AUDIT ===');
console.log('Total product folders:', folders.length);

let totalAuditFiles = 0;
let totalRawImages = 0;
let totalApprovedImages = 0;
let foldersWithApproved = 0;

folders.forEach(f => {
  const p = path.join(boutiqueDir, f);
  const files = fs.readdirSync(p);
  const audits = files.filter(x => x.toLowerCase().includes('audit') || x.toLowerCase().includes('qwen') || x.endsWith('.txt') || x.endsWith('.md'));
  const approvedSub = files.find(x => x.toLowerCase().includes('website product images'));
  let approvedCount = 0;
  if (approvedSub) {
    foldersWithApproved++;
    const subFiles = fs.readdirSync(path.join(p, approvedSub));
    approvedCount = subFiles.filter(x => /\.(jpg|jpeg|png|webp)$/i.test(x)).length;
    totalApprovedImages += approvedCount;
  }
  const rootImages = files.filter(x => /\.(jpg|jpeg|png|webp)$/i.test(x)).length;
  totalRawImages += rootImages;
  totalAuditFiles += audits.length;
  
  const slug = f.toLowerCase().replace(/\s+/g, '-');
  const pubExists = fs.existsSync(path.join(publicDir, slug));
  
  console.log(`- ${f} (slug: ${slug}): ${audits.length} audit(s), ${rootImages} raw img, ${approvedCount} approved img | In public/products: ${pubExists ? 'YES' : 'NO'}`);
});

console.log('\nSUMMARY:');
console.log('Total Product Folders:', folders.length);
console.log('Total Audit/Intelligence Files:', totalAuditFiles);
console.log('Total Raw Client Images:', totalRawImages);
console.log('Total Approved Website Images:', totalApprovedImages);
console.log('Folders with Approved Images:', foldersWithApproved);
