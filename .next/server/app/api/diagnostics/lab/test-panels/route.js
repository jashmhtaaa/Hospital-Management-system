(()=>{var e={};e.id=9283,e.ids=[9283],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33159:()=>{},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},73327:()=>{},73482:(e,t,a)=>{"use strict";a.r(t),a.d(t,{patchFetch:()=>m,routeModule:()=>p,serverHooks:()=>b,workAsyncStorage:()=>O,workUnitAsyncStorage:()=>E});var r={};a.r(r),a.d(r,{DELETE:()=>_,GET:()=>l,GET_BY_ID:()=>u,POST:()=>d,PUT:()=>c});var s=a(2179),i=a(20540),n=a(57395),o=a(8306);async function l(e){try{let t=await Object(function(){var e=Error("Cannot find module '@/lib/session'");throw e.code="MODULE_NOT_FOUND",e}())();if(!t||!t.user)return o.NextResponse.json({error:"Unauthorized"},{status:401});let{searchParams:a}=new URL(e.url),r=a.get("categoryId"),s=a.get("isActive"),i=a.get("name"),n=parseInt(a.get("page")||"1"),l=parseInt(a.get("pageSize")||"20"),d=(n-1)*l,u=`
      SELECT 
        t.*,
        c.name as category_name,
        (SELECT COUNT(*) FROM lab_test_panel_items WHERE panel_id = t.id) as item_count;
      FROM 
        lab_tests t 
      JOIN 
        lab_test_categories c ON t.category_id = c.id;
      WHERE 
        t.is_panel = 1;
    `,c=[],_=[];r&&(_.push("t.category_id = ?"),c.push(r)),null!=s&&(_.push("t.is_active = ?"),c.push(+("true"===s))),i&&(_.push("t.name LIKE ?"),c.push(`%${i}%`)),_.length>0&&(u+=" AND "+_.join(" AND ")),u+=" ORDER BY t.name ASC LIMIT ? OFFSET ?",c.push(l,d);let p=(await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query(u,c)).results||[],O="SELECT COUNT(*) as total FROM lab_tests t WHERE t.is_panel = 1";_.length>0&&(O+=" AND "+_.join(" AND "));let E=await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query(O,c.slice(0,-2)),b=E.results?.[0]?.total||0,m=await Promise.all(p.map(async e=>{let t=`
          SELECT 
            i.test_id, 
            i.sequence, 
            t.name as test_name, 
            t.loinc_code,
            t.sample_type;
          FROM 
            lab_test_panel_items i;
          JOIN 
            lab_tests t ON i.test_id = t.id;
          WHERE 
            i.panel_id = ?
          ORDER BY 
            i.sequence;
        `,a=(await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query(t,[e.id])).results||[];return{...e,panel_items:a,available_priorities:JSON.parse(e.available_priorities||'["routine"]')}}));return o.NextResponse.json({data:m,pagination:{page:n,pageSize:l,totalCount:b,totalPages:Math.ceil(b/l)}})}catch(t){console.error("Error fetching test panels:",t);let e=t instanceof Error?t.message:String(t);return o.NextResponse.json({error:"Failed to fetch test panels",details:e},{status:500})}}async function d(e){try{let t=await Object(function(){var e=Error("Cannot find module '@/lib/session'");throw e.code="MODULE_NOT_FOUND",e}())();if(!t||!t.user)return o.NextResponse.json({error:"Unauthorized"},{status:401});if(!["admin","lab_manager"].includes(t.user.roleName))return o.NextResponse.json({error:"Forbidden"},{status:403});let a=await e.json();for(let e of["name","category_id","loinc_code","panel_items","sample_type","price"])if(!(e in a)||void 0===a[e]||""===a[e])return o.NextResponse.json({error:`Missing or invalid required field: ${e}`},{status:400});if(!/^\d+-\d+$/.test(a.loinc_code))return o.NextResponse.json({error:"Invalid LOINC code format. Expected format: #####-#"},{status:400});if(!a.panel_items||0===a.panel_items.length)return o.NextResponse.json({error:"Panel must include at least one test"},{status:400});await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query("BEGIN TRANSACTION",[]);try{let e=`
        INSERT INTO lab_tests (
          name, description, category_id, loinc_code, loinc_display,
          sample_type, sample_container, sample_volume,
          processing_time, turnaround_time, is_panel, price,
          is_active, patient_preparation, available_priorities;
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)
      `,t=[a.name,a.description||"",a.category_id,a.loinc_code,a.loinc_display||"",a.sample_type,a.sample_container||"",a.sample_volume||"",a.processing_time||null,a.turnaround_time||null,a.price,void 0===a.is_active?1:+!!a.is_active,a.patient_preparation||"",JSON.stringify(a.available_priorities||["routine"])],r=(await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query(e,t)).insertId;for(let e of a.panel_items)await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query("INSERT INTO lab_test_panel_items (panel_id, test_id, sequence) VALUES (?, ?, ?)",[r,e.test_id,e.sequence||0]);await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query("COMMIT",[]);let s=`
        SELECT 
          t.*,
          c.name as category_name;
        FROM 
          lab_tests t 
        JOIN 
          lab_test_categories c ON t.category_id = c.id;
        WHERE 
          t.id = ?
      `,i=await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query(s,[r]),n=i.results?.[0];if(!n)throw Error("Failed to retrieve created panel");let l=`
        SELECT 
          i.test_id, 
          i.sequence, 
          t.name as test_name, 
          t.loinc_code,
          t.sample_type;
        FROM 
          lab_test_panel_items i;
        JOIN 
          lab_tests t ON i.test_id = t.id;
        WHERE 
          i.panel_id = ?
        ORDER BY 
          i.sequence;
      `,d=(await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query(l,[r])).results||[],u={...n,panel_items:d,available_priorities:JSON.parse(n.available_priorities||'["routine"]')};return o.NextResponse.json(u,{status:201})}catch(e){throw await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query("ROLLBACK",[]),e}}catch(t){console.error("Error creating test panel:",t);let e=t instanceof Error?t.message:String(t);return o.NextResponse.json({error:"Failed to create test panel",details:e},{status:500})}}async function u(e,{params:t}){try{let e=await Object(function(){var e=Error("Cannot find module '@/lib/session'");throw e.code="MODULE_NOT_FOUND",e}())();if(!e||!e.user)return o.NextResponse.json({error:"Unauthorized"},{status:401});let a=t.id,r=`
      SELECT 
        t.*,
        c.name as category_name;
      FROM 
        lab_tests t 
      JOIN 
        lab_test_categories c ON t.category_id = c.id;
      WHERE 
        t.id = ? AND t.is_panel = 1;
    `,s=await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query(r,[a]),i=s.results?.[0];if(!i)return o.NextResponse.json({error:"Test panel not found"},{status:404});let n=`
      SELECT 
        i.test_id, 
        i.sequence, 
        t.name as test_name, 
        t.loinc_code,
        t.sample_type;
      FROM 
        lab_test_panel_items i;
      JOIN 
        lab_tests t ON i.test_id = t.id;
      WHERE 
        i.panel_id = ?
      ORDER BY 
        i.sequence;
    `,l=(await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query(n,[a])).results||[],d={...i,panel_items:l,available_priorities:JSON.parse(i.available_priorities||'["routine"]')};return o.NextResponse.json(d)}catch(t){console.error("Error fetching test panel:",t);let e=t instanceof Error?t.message:String(t);return o.NextResponse.json({error:"Failed to fetch test panel",details:e},{status:500})}}async function c(e,{params:t}){try{let a=await Object(function(){var e=Error("Cannot find module '@/lib/session'");throw e.code="MODULE_NOT_FOUND",e}())();if(!a||!a.user)return o.NextResponse.json({error:"Unauthorized"},{status:401});if(!["admin","lab_manager"].includes(a.user.roleName))return o.NextResponse.json({error:"Forbidden"},{status:403});let r=t.id,s=await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query("SELECT id FROM lab_tests WHERE id = ? AND is_panel = 1",[r]);if(!s.results||0===s.results.length)return o.NextResponse.json({error:"Test panel not found"},{status:404});let i=await e.json();await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query("BEGIN TRANSACTION",[]);try{let e="UPDATE lab_tests SET ",t=[],a=[];if(void 0!==i.name&&(t.push("name = ?"),a.push(i.name)),void 0!==i.description&&(t.push("description = ?"),a.push(i.description)),void 0!==i.category_id&&(t.push("category_id = ?"),a.push(i.category_id)),void 0!==i.loinc_code){if(!/^\d+-\d+$/.test(i.loinc_code))throw Error("Invalid LOINC code format. Expected format: #####-#");t.push("loinc_code = ?"),a.push(i.loinc_code)}if(void 0!==i.loinc_display&&(t.push("loinc_display = ?"),a.push(i.loinc_display)),void 0!==i.sample_type&&(t.push("sample_type = ?"),a.push(i.sample_type)),void 0!==i.sample_container&&(t.push("sample_container = ?"),a.push(i.sample_container)),void 0!==i.sample_volume&&(t.push("sample_volume = ?"),a.push(i.sample_volume)),void 0!==i.processing_time&&(t.push("processing_time = ?"),a.push(i.processing_time)),void 0!==i.turnaround_time&&(t.push("turnaround_time = ?"),a.push(i.turnaround_time)),void 0!==i.price&&(t.push("price = ?"),a.push(i.price)),void 0!==i.is_active&&(t.push("is_active = ?"),a.push(+!!i.is_active)),void 0!==i.patient_preparation&&(t.push("patient_preparation = ?"),a.push(i.patient_preparation)),void 0!==i.available_priorities&&(t.push("available_priorities = ?"),a.push(JSON.stringify(i.available_priorities))),t.length>0&&(e+=t.join(", ")+" WHERE id = ?",a.push(r),await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query(e,a)),void 0!==i.panel_items)if(await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query("DELETE FROM lab_test_panel_items WHERE panel_id = ?",[r]),i.panel_items.length>0)for(let e of i.panel_items)await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query("INSERT INTO lab_test_panel_items (panel_id, test_id, sequence) VALUES (?, ?, ?)",[r,e.test_id,e.sequence||0]);else throw Error("Panel must include at least one test");await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query("COMMIT",[]);let s=`
        SELECT 
          t.*,
          c.name as category_name;
        FROM 
          lab_tests t 
        JOIN 
          lab_test_categories c ON t.category_id = c.id;
        WHERE 
          t.id = ?
      `,n=await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query(s,[r]),l=n.results?.[0];if(!l)throw Error("Failed to retrieve updated panel");let d=`
        SELECT 
          i.test_id, 
          i.sequence, 
          t.name as test_name, 
          t.loinc_code,
          t.sample_type;
        FROM 
          lab_test_panel_items i;
        JOIN 
          lab_tests t ON i.test_id = t.id;
        WHERE 
          i.panel_id = ?
        ORDER BY 
          i.sequence;
      `,u=(await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query(d,[r])).results||[],c={...l,panel_items:u,available_priorities:JSON.parse(l.available_priorities||'["routine"]')};return o.NextResponse.json(c)}catch(e){throw await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query("ROLLBACK",[]),e}}catch(t){console.error("Error updating test panel:",t);let e=t instanceof Error?t.message:String(t);return o.NextResponse.json({error:"Failed to update test panel",details:e},{status:500})}}async function _(e,{params:t}){try{let e=await Object(function(){var e=Error("Cannot find module '@/lib/session'");throw e.code="MODULE_NOT_FOUND",e}())();if(!e||!e.user)return o.NextResponse.json({error:"Unauthorized"},{status:401});if(!["admin","lab_manager"].includes(e.user.roleName))return o.NextResponse.json({error:"Forbidden"},{status:403});let a=t.id,r=await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query("SELECT id FROM lab_tests WHERE id = ? AND is_panel = 1",[a]);if(!r.results||0===r.results.length)return o.NextResponse.json({error:"Test panel not found"},{status:404});let s=await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query("SELECT id FROM lab_order_items WHERE test_id = ? LIMIT 1",[a]);if(s.results&&s.results.length>0)return await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query("UPDATE lab_tests SET is_active = 0 WHERE id = ?",[a]),o.NextResponse.json({message:"Panel has been used in orders and cannot be deleted. It has been marked as inactive instead."});await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query("BEGIN TRANSACTION",[]);try{return await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query("DELETE FROM lab_test_panel_items WHERE panel_id = ?",[a]),await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query("DELETE FROM lab_tests WHERE id = ?",[a]),await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query("COMMIT",[]),o.NextResponse.json({message:"Test panel deleted successfully"})}catch(e){throw await Object(function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}()).query("ROLLBACK",[]),e}}catch(t){console.error("Error deleting test panel:",t);let e=t instanceof Error?t.message:String(t);return o.NextResponse.json({error:"Failed to delete test panel",details:e},{status:500})}}!function(){var e=Error("Cannot find module '@/lib/database'");throw e.code="MODULE_NOT_FOUND",e}(),function(){var e=Error("Cannot find module '@/lib/session'");throw e.code="MODULE_NOT_FOUND",e}();let p=new s.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/diagnostics/lab/test-panels/route",pathname:"/api/diagnostics/lab/test-panels",filename:"route",bundlePath:"app/api/diagnostics/lab/test-panels/route"},resolvedPagePath:"/workspace/Hospital-Management-System/src/app/api/diagnostics/lab/test-panels/route.ts",nextConfigOutput:"",userland:r}),{workAsyncStorage:O,workUnitAsyncStorage:E,serverHooks:b}=p;function m(){return(0,n.patchFetch)({workAsyncStorage:O,workUnitAsyncStorage:E})}}};var t=require("../../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[7395,6088],()=>a(73482));module.exports=r})();