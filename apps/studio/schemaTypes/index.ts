import * as blocks from './blocks'
import { page } from './page'
import { employee } from './employee'
import { menu } from './menu'
import { siteSettings } from './siteSettings'
import { ctaButton, navigationLink } from './common'

export const schemaTypes = [
  // Documents
  page,
  employee,
  menu,
  siteSettings,
  
  // Common Types
  ctaButton,
  navigationLink,
  
  // Content Blocks
  blocks.heroBlock,
  blocks.backgroundImageTextBlock,
  blocks.imageBlock,
  blocks.textBlock,
  blocks.accordionBlock,
  blocks.textAndImageBlock,
  blocks.foodSliderBlock,
  blocks.menuBlock,
  blocks.imageGridBlock
]
