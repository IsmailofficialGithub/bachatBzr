
import Head  from "next/head";

const PageHead = ({ headTitle }) => {
    return (
        <>
            <Head>
                <title>
                    {headTitle ? headTitle : "Name - BacharBzr"}
                </title>
                {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>
        </>
    )
}

export default PageHead

