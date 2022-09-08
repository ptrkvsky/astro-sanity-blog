import type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
} from 'sanity-codegen';

export type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
};

/**
 * Post
 *
 *
 */
export interface Post extends SanityDocument {
  _type: 'post';

  /**
   * SEO title — `string`
   *
   *
   */
  seoTitle?: string;

  /**
   * SEO description — `string`
   *
   *
   */
  seoDescription?: string;

  /**
   * Keywords — `string`
   *
   *
   */
  seoKeywords?: string;

  /**
   * SEO Image — `image`
   *
   *
   */
  seoImage?: {
    _type: 'image';
    asset: SanityImageAsset;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Questions and answers — `array`
   *
   * Questions and answers for SEO graph
   */
  content?: Array<SanityKeyed<QuestionsAnswers>>;

  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Description — `text`
   *
   *
   */
  description?: string;

  /**
   * Type — `string`
   *
   *
   */
  type?: 'definition' | 'post';

  /**
   * Display on Homepage — `boolean`
   *
   *
   */
  isHome?: boolean;

  /**
   * Slug — `slug`
   *
   *
   */
  slug?: { _type: 'slug'; current: string };

  /**
   * Main image — `image`
   *
   *
   */
  mainImage?: {
    _type: 'image';
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Categories — `array`
   *
   *
   */
  categories?: Array<SanityKeyedReference<Category>>;

  /**
   * Published at — `datetime`
   *
   *
   */
  publishedAt?: string;

  /**
   * Edited at — `datetime`
   *
   *
   */
  editedAt?: string;

  /**
   * Body — `blockContent`
   *
   *
   */
  bodyRaw?: BlockContent;
}

/**
 * Category
 *
 *
 */
export interface Category extends SanityDocument {
  _type: 'category';

  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Description — `text`
   *
   *
   */
  description?: string;
}

export type QuestionsAnswers = {
  _type: 'questionsAnswers';
  /**
   * Question — `text`
   *
   *
   */
  question?: string;

  /**
   * Answer — `text`
   *
   *
   */
  answer?: string;
};

export type BlockContent = Array<
  | SanityKeyed<SanityBlock>
  | SanityKeyed<{
      _type: 'image';
      asset: SanityReference<SanityImageAsset>;
      crop?: SanityImageCrop;
      hotspot?: SanityImageHotspot;
    }>
  | SanityKeyed<Code>
>;

export type Documents = Post | Category;

/**
 * This interface is a stub. It was referenced in your sanity schema but
 * the definition was not actually found. Future versions of
 * sanity-codegen will let you type this explicity.
 */
type Code = any;
