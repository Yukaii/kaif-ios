//
//  ShareViewController.m
//  ShareLink
//
//  Created by Yukai Huang on 1/28/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "ShareViewController.h"
#import "NewPost.h"

@interface ShareViewController ()

@end

@implementation ShareViewController

//- (BOOL)isContentValid {
//    // Do validation of contentText and/or NSExtensionContext attachments here
//    return YES;
//}
//
//- (void)didSelectPost {
//    // This is called after the user selects Post. Do the upload of contentText and/or NSExtensionContext attachments.
//    
//    // Inform the host that we're done, so it un-blocks its UI. Note: Alternatively you could call super's -didSelectPost, which will similarly complete the extension context.
//    [self.extensionContext completeRequestReturningItems:@[] completionHandler:nil];
//}
//
//- (NSArray *)configurationItems {
//    // To add configuration options via table cells at the bottom of the sheet, return an array of SLComposeSheetConfigurationItem here.
//    return @[];
//}

- (void) viewDidLoad {
  [super viewDidLoad];

  NewPost *newPostController = [[NewPost alloc] init];


  [self presentViewController:newPostController animated:YES completion:nil];

  // via http://stackoverflow.com/questions/26362329/customize-slcomposeserviceviewcontroller-pop-up-of-share-extension-ios-8
  NSExtensionItem *item = self.extensionContext.inputItems.firstObject;
  NSItemProvider *itemProvider = item.attachments.firstObject;
  if ([itemProvider hasItemConformingToTypeIdentifier:@"public.url"]) {
    [itemProvider loadItemForTypeIdentifier:@"public.url"
                                    options:nil
                          completionHandler:^(NSURL *url, NSError *error) {
                            NSString *urlString = url.absoluteString;
                            NSLog(@"%@",urlString);
                          }];
  }
}

@end
