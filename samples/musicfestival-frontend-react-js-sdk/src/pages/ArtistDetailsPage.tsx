import parse from 'html-react-parser'
import { getImageUrl } from '../helpers/urlHelper'
import FormComponent from '../Forms'
import { FormContainer } from '@episerver/forms-sdk'

type ArtistDetailsPageProps = {
    content: any
}

function ArtistDetailsPage({ content }: ArtistDetailsPageProps) {
    return (
        <>
            <div className="ArtistDetailsPage">
                <nav className="Page-container PageHeader NavBar">
                    <div className="backButton">
                        <a href={content.ParentLink?.Url} className="EPiLink">
                            <span></span>
                        </a>
                    </div>
                </nav>
                <div className="Page-container u-posRelative">
                    <div className="artistImage">
                        {(() => {
                            if (content?.ArtistPhoto && content.ArtistPhoto.length > 0) {
                                return (
                                    <img src={getImageUrl(content?.ArtistPhoto)}
                                        className="ConditionalImage"
                                        alt={content?.ArtistName ?? ''}
                                    />
                                )
                            }
                        })()}
                    </div>
                    <div className='top'>
                        <h1 data-epi-edit="ArtistName">{content?.ArtistName}</h1>
                    </div>
                    <div className="artist-information">
                        <p data-epi-edit="StageName">{content?.StageName}</p>
                        <p><span data-epi-edit="PerformanceStartTime">{content?.PerformanceStartTime}</span> - <span data-epi-edit="PerformanceEndTime">{content?.PerformanceEndTime}</span></p>
                    </div>
                    <div className="artist-description" data-epi-edit="ArtistDescription">
                        {parse(content?.ArtistDescription ?? '')}
                    </div>
                    <div className='Form'>
                        {
                            content.ContentArea.map((contentArea: any) => {
                                /**
                                * Retrieve data from the content graph and interpret it as a string. 
                                * This data can be cast into a FormContainer object for utilization.
                                * 
                                * For instance, in this scenario, we demonstrate the creation of a React form component, 
                                * where the FormContainer object serves as a variable input. 
                                * 
                                * Regardless of the framework utilized, such as React or otherwise, 
                                * the fundamental approach remains consistent: leveraging the retrieved data 
                                * to dynamically render a customized form according to specific requirements.
                                */
                                let formData = JSON.parse(contentArea.ContentLink.Expanded.FormRenderTemplate) as FormContainer
                                return (
                                    <FormComponent
                                        key={formData.key}
                                        formData={formData}
                                    ></FormComponent>
                                )
                            })
                        }
                    </div>
                </div>
                <footer>
                    <div className="FooterBottom">
                        <h6>&copy; Music Festival 2020</h6>
                    </div>
                </footer>
            </div>
        </>
    )
}

export default ArtistDetailsPage;