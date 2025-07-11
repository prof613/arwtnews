import type { Attribute, Schema } from '@strapi/strapi';

export interface BlocksEnhancedImage extends Schema.Component {
  collectionName: 'components_blocks_enhanced_images';
  info: {
    description: 'Image with alignment and sizing options';
    displayName: 'Enhanced Image';
  };
  attributes: {
    alignment: Attribute.Enumeration<['left', 'right', 'center', 'full']> &
      Attribute.DefaultTo<'center'>;
    caption: Attribute.String;
    image: Attribute.Media<'images'> & Attribute.Required;
    size: Attribute.Enumeration<['small', 'medium', 'large', 'full']> &
      Attribute.DefaultTo<'medium'>;
  };
}

export interface BlocksEnhancedText extends Schema.Component {
  collectionName: 'components_blocks_enhanced_texts';
  info: {
    description: 'Text with styling and layout options';
    displayName: 'Enhanced Text';
  };
  attributes: {
    content: Attribute.Blocks;
    layout: Attribute.Enumeration<['single', 'twocolumn']> &
      Attribute.DefaultTo<'single'>;
    style: Attribute.Enumeration<
      ['normal', 'pullquote', 'infobox', 'alert', 'breaking']
    > &
      Attribute.DefaultTo<'normal'>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'blocks.enhanced-image': BlocksEnhancedImage;
      'blocks.enhanced-text': BlocksEnhancedText;
    }
  }
}
