import { Tagihan } from "@components/Tagihan"


export async function getServerSideProps (context) {
    return {
        props: {
            id: context.params.idBill
        }
    }

}

export default function TagihanRoom ({id})  {
    return <Tagihan idBill={id} />
}