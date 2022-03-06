import WeaverseContent, {weaverseContext} from '../weaverse-content'

export async function getServerSideProps() {
  let data = await weaverseContext.fetchProjectData()
  return {
    props: data // will be passed to the page component as props
  }
}

export default function Home(props) {
  return (
    <WeaverseContent defaultData={props}/>
  )
}
