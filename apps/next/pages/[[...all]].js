import WeaverseContent, {weaverseContext} from '../weaverse-content'

export async function getStaticProps() {
  let data = await weaverseContext.fetchProjectData()
  return {
    props: data // will be passed to the page component as props
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  }
}

export default function Home(props) {
  return (
    <WeaverseContent defaultData={props}/>
  )
}
