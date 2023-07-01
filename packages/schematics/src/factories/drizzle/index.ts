import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/sdk';
import { BasicOptions } from '@mountnotion/types';
import { logSuccess, strings } from '@mountnotion/utils';
import * as dotenv from 'dotenv';
import { rimraf } from 'rimraf';
import { applyWithOverwrite } from '../../rules';
import { validateInputs } from './validate-inputs';

dotenv.config();
export function drizzle(options: BasicOptions): Rule {
  logSuccess({ action: 'running', message: 'drizzle schematic' });
  logSuccess({ action: '-------', message: '-----------------' });
  validateInputs(options);
  const { outDir } = options;

  const pageIds = [options.pageId].flat();
  const excludes = options.excludes ?? [];
  return async () => {
    await rimraf(outDir);
    const caches = await createDatabaseCaches(pageIds, options);
    const includedCaches = caches.filter(
      ({ title }) => title && !excludes.includes(title)
    );
    const titles = includedCaches.map((cache) => cache.title);
    const drizzleRules = includedCaches.map((cache) => {
      return applyWithOverwrite(url('./files/all'), [
        template({
          title: cache.title,
          cache,
          options,
          ...strings,
        }),
        move(outDir),
      ]);
    });
    const drizzleIndexRule = applyWithOverwrite(url('./files/index'), [
      template({
        titles,
        ...strings,
      }),
      move(outDir),
    ]);
    return chain([...drizzleRules, drizzleIndexRule]);
  };
}
