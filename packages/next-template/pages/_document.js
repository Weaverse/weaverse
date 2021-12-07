import React from 'react';
import NextDocument, {Head, Html, Main, NextScript} from 'next/document';
import {stitches} from "@weaverse/react";


export default class Document extends NextDocument {
	render() {
		return (
			<Html lang="en">
				<Head>
					<style id="stitches" dangerouslySetInnerHTML={{__html: stitches.getCssText()}}/>
				</Head>
				<body>
				<Main/>
				<NextScript/>
				</body>
			</Html>
		);
	}
}