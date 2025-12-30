// Test template loading
import { AUTOMATION_TEMPLATES } from './services/templateService.ts';

console.log('Total templates loaded:', AUTOMATION_TEMPLATES.length);
AUTOMATION_TEMPLATES.forEach((t, i) => {
    console.log(`${i+1}. ${t.name} (${t.category}) - ${t.estimatedRevenue}`);
});
