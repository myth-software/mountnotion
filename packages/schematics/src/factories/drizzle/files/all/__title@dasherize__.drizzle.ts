import { InferModel } from 'drizzle-orm';
import { pgTable, pgEnum, boolean, numeric, serial, text, varchar, uuid, json, timestamp } from "drizzle-orm/pg-core";
 
export const <%= camelize(title) %> = pgTable('<%= dasherize(title) %>', {
  id: uuid('id').defaultRandom().primaryKey(),
  icon: text('icon').notNull(),
  cover: text('cover').notNull(),
  description: text('description').notNull(),
  <% for(const [property, column] of Object.entries(cache.mappings)) { const type = cache.columns[column];  %>
    '<%= property %>':
      <% if(type === 'rollup' || type === 'last_edited_by' || type === 'last_edited_time' || type === 'created_by' || type === 'created_time' ) { %>
      <% } %>
      <% if(type === 'relation') { %>
        text('<%= property %>').array()
      <% } else if(type === 'last_edited_time' || type === 'created_time') { %>
        timestamp('<%= property %>').defaultNow()
      <% } else if(type === 'checkbox') { %>
        boolean('<%= property %>')
      <% } else if(cache.options?.[column] && type === 'multi_select') {  %>
        pgEnum('<%= property %>', [
          <% cache.options[column].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
        ])('<%= property %>').array()
      <% } else if(cache.options?.[column] && (type === 'select' || type === 'status')) {  %>
        pgEnum('<%= property %>', [
          <% cache.options[column].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
        ])('<%= property %>')
      <% } else if(cache.rollupsOptions?.[property]) {  %>
        pgEnum('<%= property %>', [
          <% cache.rollupsOptions[property].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
        ])('<%= property %>').array()
      <% } else if(type === 'rollup') { %>
      <% } else if(type === 'files') { %>
        text('<%= property %>').array()
      <% } else if(type === 'number') { %>
        numeric('<%= property %>')
      <% } else { %>
        text('<%= property %>')
      <% } %>
    ,
  <% } %>
});

<% if(description) { %>
/** <%= description %> */
<% } %>
export declare type <%= classify(title) %> = InferModel<typeof <%= camelize(title) %>>;
export declare type New<%= classify(title) %> = InferModel<typeof <%= camelize(title) %>, 'insert'>;
