// Create a pixel Component that will be used to track page views
// /api/public/weaverse-pixel?projectId=xxx&pageId=xxx
// The pixel will be removed from the DOM after it is loaded

import React from 'react'

import type { WeaverseHydrogen } from './index'

export interface PixelProps {
  baseUrl: string
  projectId: string
  pageId: string
}

export function Pixel({ baseUrl, projectId, pageId }: PixelProps) {
  const url = `${baseUrl}/api/public/px?projectId=${projectId}&pageId=${pageId}`
  return <img src={url} alt="weaverse pixel" style={{ display: 'none' }} />
}

export function WeaversePixel({ context }: { context: WeaverseHydrogen }) {
  let { projectId, pageId, weaverseHost, isDesignMode } = context
  if (isDesignMode || !projectId || !pageId || !weaverseHost) return null
  return <Pixel baseUrl={weaverseHost} projectId={projectId} pageId={pageId} />
}
