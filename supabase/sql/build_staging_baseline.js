const fs = require('fs');
const path = require('path');
const dir = __dirname;
const order = [
  '2025-11-04_core_schema.sql',
  '2025-12-20_module_10A_remove_child_name.sql',
  '2025-12-30_fix_theme_anonymous_access.sql',
  '202601041654_pl0_product_library.sql',
  '202601041700_pl1_pool_items.sql',
  '202601050000_pl_category_types_and_products.sql',
  '202601050001_remove_rating_min_constraint.sql',
  '202601050002_pl2_public_read_policies.sql',
  '202601060000_manus_ready_scoring_and_evidence.sql',
  '202601060001_pl_autopilot_locks.sql',
  '202601142252_pl_need_ux_labels.sql',
  '202601150000_phase_a_db_foundation.sql',
  '202601150000_phase2a_canonise_layer_a_development_needs.sql',
  '202602080000_pl_category_type_images.sql',
  '202602190000_subnav_saves_and_consent.sql',
  '202602250000_family_user_list_items.sql',
  '202602261000_subnav_gifts_count.sql',
  '202602280000_children_display_name.sql',
  '202602281000_children_child_name.sql',
  '202603031000_subnav_stats_per_child.sql',
  '202603031100_upsert_user_list_item_child.sql',
  '202603031200_upsert_drop_old_overload.sql',
  '202603031300_subnav_stats_child_only.sql',
  '202603041000_children_is_suppressed.sql',
  '202603041100_gift_shares.sql',
  '202603041200_gift_list_child_id.sql',
  '202603041300_get_gift_share_list_title.sql',
  '202603041400_gift_list_image_from_gateway.sql',
  '202603051000_suppress_saves_for_suppressed_children.sql',
  '202603051100_gift_list_hide_legacy.sql',
  '202603051200_marketplace_pg_trgm_item_types.sql',
  '202603051201_marketplace_listings_tables.sql',
  '202603051202_marketplace_rls.sql',
  '202603051203_marketplace_storage.sql',
  '202603051204_marketplace_suggest_rpc.sql',
];
let out = '-- Staging baseline: run once in Supabase SQL Editor for new staging project.\n';
out += '-- Order matches repo migrations; 202603051000 uses full suppress_saves file (not PART1+PART2).\n\n';
for (const f of order) {
  const full = path.join(dir, f);
  if (!fs.existsSync(full)) throw new Error('Missing: ' + f);
  out += '-- === ' + f + ' ===\n\n';
  out += fs.readFileSync(full, 'utf8');
  if (!out.endsWith('\n')) out += '\n';
  out += '\n';
}
fs.writeFileSync(path.join(dir, 'staging_baseline.sql'), out);
console.log('Wrote staging_baseline.sql');
