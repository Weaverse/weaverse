import React from 'react'
import NextDocument, {Head, Html, Main, NextScript} from 'next/document'
import {weaverseContext} from '../weaverse-content'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <style id="stitches" dangerouslySetInnerHTML={{__html: weaverseContext.stitchesInstance.getCssText()}}/>
        </Head>
        <body>
        <Main/>
        <NextScript/>
        </body>
			</Html>
		);
	}
}