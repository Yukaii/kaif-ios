//
//  ReactView.m
//  KaifIoIos
//
//  Created by Yukai Huang on 1/30/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "ReactView.h"
#import "RCTRootView.h"

@implementation ReactView
-(void) awakeFromNib {
  NSURL *jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation moduleName: @"SimpleApp" initialProperties:nil launchOptions:nil];

  [self addSubview:rootView];
  rootView.frame = self.bounds;
}
@end
