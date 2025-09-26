import * as blocks from './blocks'
import { page } from './page'
import { article } from './article'
import { portfolio } from './portfolio'
import { employee } from './employee'
import { solutions } from './solutions'
import { menu } from './menu'
import { siteSettings } from './siteSettings'
import { ctaButton, navigationLink } from './common'

export const schemaTypes = [
  // Documents
  page,
  article,
  portfolio,
  employee,
  solutions,
  menu,
  siteSettings,
  
  // Common Types
  ctaButton,
  navigationLink,
  
  // Content Blocks
  blocks.heroBlock,
  blocks.heroTextBlock,
  blocks.backgroundImageTextBlock,
  blocks.textBlock,
  blocks.accordionBlock,
  blocks.archiveBlock,
  blocks.employeesBlock,
  blocks.textAndImageBlock,
  blocks.textAndVideoBlock,
  blocks.sliderBlock,
  blocks.numbersBlock,
  blocks.serviceSliderBlock
]
