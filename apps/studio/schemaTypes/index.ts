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
  blocks.heroTextBlock,
  blocks.backgroundImageTextBlock,
  blocks.imageBlock,
  blocks.textBlock,
  blocks.accordionBlock,
  blocks.archiveBlock,
  blocks.employeesBlock,
  blocks.textAndImageBlock,
  blocks.textAndVideoBlock,
    blocks.sliderBlock,
    blocks.numbersBlock,
    blocks.foodSliderBlock,
    blocks.menuBlock,
    blocks.imageGridBlock,
    blocks.leadFormBlock
]
