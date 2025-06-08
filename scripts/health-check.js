// Health check script
const { execSync } = require('child_process');

console.log('🏥 Running HMS Health Checks...');

const checks = [
  {
    name: 'TypeScript Compilation',
    command: 'npx tsc --noEmit'
  },
  {
    name: 'Dependencies Check',
    command: 'npm audit --audit-level=high'
  }
];

let passed = 0;
let total = checks.length;

checks.forEach(check => {
  try {
    execSync(check.command, { stdio: 'pipe' });
    console.log(`✅ ${check.name}: PASS`);
    passed++;
  } catch (error) {
    console.log(`❌ ${check.name}: FAIL`);
  }
});

console.log(`\n📈 Overall: ${passed}/${total} checks passed`);
process.exit(passed === total ? 0 : 1);
