import type { CSSProperties } from 'react'

export let slidePositionMap: Record<string, CSSProperties> = {
  'top left': {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  'top center': {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  'top right': {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  'center left': {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  'center center': {
    justifyContent: 'center',
    alignItems: 'center',
  },
  'center right': {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  'bottom left': {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  'bottom center': {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  'bottom right': {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
}
