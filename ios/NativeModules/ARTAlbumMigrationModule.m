

#import "ARTAlbumMigrationModule.h"

@implementation ARTAlbumMigrationModule

RCT_EXPORT_MODULE()

#define ARTPersistedDataFileName @"PersistedData.folio.keep"
#define ARTAlbumMigrationAttemptsKey @"ARTAlbumMigrationAttemptsKey"
#define ARTAlbumsHaveSuccessfullyMigratedKey @"ARTAlbumsHaveSuccessfullyMigratedKey"
#define ART_MAX_MIGRATION_ATTEMPTS 3

RCT_EXPORT_METHOD(addTestAlbums)
{
  [self persistTestAlbums];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(readAlbums)
{
  BOOL hasSuccessfullyMigrated = [[NSUserDefaults standardUserDefaults] boolForKey:ARTAlbumsHaveSuccessfullyMigratedKey];
  NSInteger migrationAttempts = [[NSUserDefaults standardUserDefaults] integerForKey:ARTAlbumMigrationAttemptsKey];

  if (hasSuccessfullyMigrated || migrationAttempts > ART_MAX_MIGRATION_ATTEMPTS) {
    return nil;
  }

  NSString *documentsDirectory = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
  NSString *filename = [documentsDirectory stringByAppendingPathComponent:ARTPersistedDataFileName];

  NSDictionary *persistedData = [NSDictionary dictionaryWithContentsOfFile:filename];

  NSDictionary *albumData = [persistedData objectForKey:@"albums"];

  if (albumData) {
    [[NSUserDefaults standardUserDefaults] setBool:YES forKey:ARTAlbumsHaveSuccessfullyMigratedKey];
  }

  migrationAttempts = migrationAttempts + 1;
  [[NSUserDefaults standardUserDefaults] setInteger:migrationAttempts forKey:ARTAlbumMigrationAttemptsKey];

  return albumData;
}

RCT_EXPORT_METHOD(resetAlbumReadAttempts)
{
  [[NSUserDefaults standardUserDefaults] setBool:NO forKey:ARTAlbumsHaveSuccessfullyMigratedKey];
  [[NSUserDefaults standardUserDefaults] setInteger:0 forKey:ARTAlbumMigrationAttemptsKey];
}

- (void)persistTestAlbums
{
  NSDictionary *testAlbums = @{
    @"albums": @[
      @{ @"name": @"test album 3",
         @"artworkIDs": @[
           @"51815fd95a9dc26e68000179",
           @"56ea2be6cb4c27658a00108f",
           @"57277ed2139b2112710039fd",
           @"55d7907772616953f7000106"
         ],
      },
      @{ @"name": @"test album 2",
         @"artworkIDs": @[
           @"51815fd95a9dc26e68000179",
           @"56ea2be6cb4c27658a00108f",
           @"57277ed2139b2112710039fd",
           @"55d7907772616953f7000106"
         ],
      },
      @{ @"name": @"test album 1",
         @"artworkIDs": @[
           @"51815fd95a9dc26e68000179",
           @"56ea2be6cb4c27658a00108f",
           @"57277ed2139b2112710039fd",
           @"55d7907772616953f7000106"
         ],
      },
      @{ @"name": @"Test Album 11",
         @"artworkIDs": @[
           @"5176b83271e36606b5000019",
           @"test-test",
           @"517ea63a7f6107c380000162",
           @"51816268250db946400002b8",
           @"51648886f573c10a6e000100",
           @"518162687b979f1025000176",
           @"luther-blissett-thumbs-up"
         ],
      }
    ]
  };

  NSString *documentsDirectory = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
  NSString *filename = [documentsDirectory stringByAppendingPathComponent:ARTPersistedDataFileName];

  if (![testAlbums writeToFile:filename atomically:YES]) {
    NSLog(@"Couldn't persist data.");
  }
}

@end
