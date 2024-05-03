import { Form, FormLogin } from '@episerver/forms-react';
import { FormCache, FormConstants, IdentityInfo, extractParams } from '@episerver/forms-sdk';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFetch } from '../useFetch';
import SearchButton from '../components/SearchButton';
import { getImageUrl } from '../helpers/urlHelper';
import authService from '../authService';

type BuyTicketPageProps = {
    content: any,
}

function BuyTicketPage({ content }: BuyTicketPageProps) {
    const location = useLocation();
    const { language } = extractParams(window.location.pathname)
    const url = `${process.env.REACT_APP_ENDPOINT_GET_FORM_BY_PAGE_URL}${location.pathname}`;

    const { data: pageData, loading } = useFetch(url);

    const formCache = new FormCache();

    const [identityInfo, setIdentityInfo] = useState<IdentityInfo>({
        accessToken: formCache.get<string>(FormConstants.FormAccessToken)
    } as IdentityInfo);

    useEffect(() => {
        setIdentityInfo({
            accessToken: formCache.get<string>(FormConstants.FormAccessToken)
        } as IdentityInfo)
    }, [formCache.get<string>(FormConstants.FormAccessToken)]);

    const history = useNavigate()
    return (
        <>
            {loading && <div className='loading'>Loading...</div>}

            {!loading && pageData &&
                <div>
                    <nav className="Page-container PageHeader NavBar">
                        <div className="nav-table">
                            <div className="nav-table-row">
                                <div className="nav-table-cell">
                                    <button className="Button buy-ticket-button"
                                        onClick={() => {
                                            window.location.href = `${window.location.origin}/en/buy-ticket-now/`;
                                        }}
                                    >{content?.Name}</button>
                                </div>
                                <div className="nav-table-cell search-button-block">
                                    <SearchButton />
                                </div>
                            </div>
                        </div>
                    </nav>
                    <main className='Page-container'>
                        {pageData.childrens.map((c: any) => (
                            <Form
                                key={c.reference.key}
                                formKey={c.reference.key}
                                language={language ?? "en"}
                                baseUrl={process.env.REACT_APP_HEADLESS_FORM_BASE_URL ?? "/"}
                                identityInfo={identityInfo}
                                history={history}
                                currentPageUrl={pageData.pageUrl}
                                optiGraphUrl={process.env.REACT_APP_CONTENT_GRAPH_GATEWAY_URL}
                            />
                        ))}
                    </main>
                </div>
            }
        </>
    )
}

export default BuyTicketPage;