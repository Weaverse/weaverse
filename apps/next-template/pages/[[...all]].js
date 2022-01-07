import WeaverseContent from '../weaverse-content'

export async function getServerSideProps(context) {
  // let data = await weaverseContext.fetchProjectData()
  let data = {
    items: [
      {
        id: 0,
        type: 'base',
        description: 'This is item 1',
        childIds: [1, 2],
        css: {
          backgroundColor: 'blue'
        }
      },
      {
        id: 1,
        type: 'button',
        description: 'This is item 1',
        childIds: []
      },
      {
        id: 2,
        type: 'base',
        description: 'This is item 2',
        childIds: [3, 4, 5, 6],
        css: {
          display: 'grid',
          backgroundColor: 'cyan',
          gridTemplateColumns: 'repeat(3, minmax(500px, 1fr))'
        }
      },
      {
        id: 3,
        type: 'button',
        description: 'This is item 3',
        childIds: []
      },
      {
        id: 4,
        type: 'button',
        description: 'This is item 4',
        childIds: []
      },
      {
        id: 5,
        type: 'button',
        description: 'This is item 5',
        childIds: []
      },
      {
        id: 6,
        type: 'button',
        description: 'This is item 7',
        childIds: []
      }
    ]
  }
  return {
    props: data // will be passed to the page component as props
  }
}

export default function Home(props) {
    return (
        <WeaverseContent defaultData={props}/>
    )
}
