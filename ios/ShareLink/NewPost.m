//
//  NewPost.m
//  KaifIoIos
//
//  Created by Yukai Huang on 1/28/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "NewPost.h"
#import "Content.h"

@implementation NewPost

- (void) viewDidLoad {
//  self.navigationBar.backgroundColor = [UIColor blueColor];

  Content* content = [[Content alloc] init];
  [self setViewControllers:@[content]];
}

@end
