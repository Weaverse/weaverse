import React, {createContext} from 'react'

const {createStitches} = require('@stitches/react')

export let stitches = createStitches({
	prefix: 'wv',
	media: {
		bp1: '(min-width: 640px)',
		bp2: '(min-width: 768px)',
		bp3: '(min-width: 1024px)'
	}
})
export let ThemeContext = createContext(stitches)
const Button = stitches.styled('button', {
	// base styles

})

export let ThemeProvider = ({theme = {}, children}: any) => {
	let themeName = theme.name || 'default'
	let themeClass = stitches.createTheme(`weaverse-theme-${themeName}`, theme.token || {})
	return (
		<ThemeContext.Provider value={stitches}>
			<div data-weaverse-root={true} className={`weaverse-root ${themeClass}`}>
				{children}
				<Button
					color={{
						'@initial': 'gray',
						'@bp2': 'violet'
					}}
				>
					Button
				</Button>
			</div>
		</ThemeContext.Provider>
	)
}
