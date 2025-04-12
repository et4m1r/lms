import * as migration_20250403_233058 from './20250403_233058';
import * as migration_20250412_093422_test from './20250412_093422_test';
import * as migration_20250412_094145_test1 from './20250412_094145_test1';

export const migrations = [
  {
    up: migration_20250403_233058.up,
    down: migration_20250403_233058.down,
    name: '20250403_233058',
  },
  {
    up: migration_20250412_093422_test.up,
    down: migration_20250412_093422_test.down,
    name: '20250412_093422_test',
  },
  {
    up: migration_20250412_094145_test1.up,
    down: migration_20250412_094145_test1.down,
    name: '20250412_094145_test1'
  },
];
