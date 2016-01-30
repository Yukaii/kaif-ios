//
//  Content.m
//  KaifIoIos
//
//  Created by Yukai Huang on 1/28/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "Content.h"
#import "Security/Security.h"

@implementation Content
- (void) viewDidLoad {
//  ReactView *view = [[ReactView alloc] initWithFrame:CGRectMake(10, 10, 100, 100)];
  CGFloat height = [[UIScreen mainScreen] bounds].size.height;
  CGFloat width = [[UIScreen mainScreen] bounds].size.width;

  UIView *view = [[UIView alloc] initWithFrame: CGRectMake(0, 0, width, height)];
  view.backgroundColor = [UIColor whiteColor];

  self.navigationItem.title = @"分享文章至 Kaif.io";
  NSDictionary *dict = [self getUserNameAndAccessToken];
//  NSLog(@"%@", dict);


//  NSLog(@"%f, %f", height, width);
//  [view setFrame: CGRectMake(0, 60, width, height)];

  [self.view addSubview: view];
}

- (NSDictionary*) getUserNameAndAccessToken {
  NSString *shareBundle = [[NSBundle mainBundle] bundleIdentifier];

  NSArray *array = [shareBundle componentsSeparatedByString: @"."];
  NSMutableArray *mutableArray = [NSMutableArray arrayWithArray: array];
  [mutableArray removeLastObject];

  NSString *service = [mutableArray componentsJoinedByString: @"."];
  NSLog(@"%@", service);

  // Create dictionary of search parameters
  NSDictionary* dict = [NSDictionary dictionaryWithObjectsAndKeys:(__bridge id)(kSecClassGenericPassword), kSecClass, service, kSecAttrService, kCFBooleanTrue, kSecReturnAttributes, kCFBooleanTrue, kSecReturnData, nil];

  // Look up server in the keychain
  NSDictionary* found = nil;
  CFTypeRef foundTypeRef = NULL;
  OSStatus osStatus = SecItemCopyMatching((__bridge CFDictionaryRef) dict, (CFTypeRef*)&foundTypeRef);

  if (osStatus != noErr && osStatus != errSecItemNotFound) {
    NSError *error = [NSError errorWithDomain:NSOSStatusErrorDomain code:osStatus userInfo:nil];
    return @{@"error": error};
  }

  found = (__bridge NSDictionary*)(foundTypeRef);
  if (!found) {
//    return callback(@[[NSNull null]]);
  }

  // Found
  NSString* username = (NSString*) [found objectForKey:(__bridge id)(kSecAttrAccount)];
  NSString* password = [[NSString alloc] initWithData:[found objectForKey:(__bridge id)(kSecValueData)] encoding:NSUTF8StringEncoding];

  NSDictionary *dictionary = @{
                               @"username": username,
                               @"password": password
                               };
  return dictionary;
}
@end
