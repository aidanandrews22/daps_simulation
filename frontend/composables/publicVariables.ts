import afterImgDefault from '@/assets/img/after.png'
import beforeImgDefault from '@/assets/img/before.png'

export const computedBeforeOrAfterImg = (img, type) => {
  return img ? img : type == 'before' ? beforeImgDefault : type == 'after' ? afterImgDefault : ''
}

export const scrollToTop = () => {
  window.scrollTo(0, 0)
}
