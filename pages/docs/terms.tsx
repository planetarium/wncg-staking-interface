import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { NextSeo } from 'next-seo'

import { TERMS_SEO } from 'lib/seo'
export { getStaticProps } from 'lib/getStaticProps'

import { StyledDocsPage } from 'styles/pages/docs'
import Favicon from 'components/Favicon'
import GlobalHooks from 'components/GlobalHooks'

const Terms: NextPage = () => {
  return (
    <StyledDocsPage>
      <NextSeo {...TERMS_SEO} />

      <Head>
        <title>Terms of Service / WNCG Staking</title>
        <meta
          name="description"
          content="Stake Balancer LP token and earn rewards!"
        />
        <Favicon />
      </Head>

      <div className="container">
        <header className="header">
          <h1 className="title">Terms of Service</h1>
          <p className="updated">
            Updated: <time dateTime="2022-06-23">June 23, 2022</time>
          </p>
        </header>

        <section className="section">
          <h2 className="hidden">Abstract</h2>
          <p>
            Welcome to 
            <Link href="/wncg">https://stake.nine-chronicles.com/wncg</Link>, a
            website-hosted user interface (together with all related subdomains
            and/or mobile applications, the “Interface”) provided by Nine
            Chronicles Ltd (“we”, “our”, or “us”). The Interface provides access
            to a decentralized protocol on the Ethereum blockchain (the
            “Protocol”).
          </p>
          <p>
            <strong>
              THE INTERFACE IS A WEB APPLICATION WHICH MERELY PROVIDES A
              NON-EXCLUSIVE, PARTIAL USER INTERFACE TO THE PROTOCOL. THE
              OWNER/OPERATOR OF THE INTERFACE DOES NOT HAVE CUSTODY OVER YOUR
              ASSETS OR ACCESS TO YOUR PRIVATE KEY AND CANNOT INITIATE A
              TRANSFER OF DIGITAL ASSETS OR OTHERWISE ACCESS YOUR DIGITAL
              ASSETS. THE INTERFACE IS NOT A BROKER OR INTERMEDIARY AND IS IN NO
              WAY YOUR AGENT, ADVISOR, OR CUSTODIAN, AND WE DO NOT HAVE A
              FIDUCIARY RELATIONSHIP OR OBLIGATION TO YOU REGARDING ANY OTHER
              DECISIONS OR ACTIVITIES THAT YOU EFFECT WHEN USING YOUR WALLET OR
              OUR SERVICES. WE ARE NOT RESPONSIBLE FOR ANY ACTIVITIES THAT YOU
              ENGAGE IN WHEN USING YOUR WALLET, AND YOU SHOULD UNDERSTAND THE
              RISKS ASSOCIATED WITH PARTICIPATING IN DECENTRALIZED PROTOCOLS ON
              THE ETHEREUM BLOCKCHAIN. UNLESS EXPLICITLY PROVIDED IN WRITING, WE
              DO NOT HOST OR MAINTAIN ECOSYSTEM PARTNERS ACCESSIBLE ON OUR
              SERVICES AND DO NOT PARTICIPATE IN ANY TRANSACTIONS ON SUCH
              ECOSYSTEM PARTNERS, RECOMMEND, ENDORSE, OR OTHERWISE TAKE A
              POSITION ON YOUR USE OF THESE SERVICES.
            </strong>
          </p>
          <p>
            This Terms of Service Agreement (the “Terms” or “Agreement”)
            explains the terms and conditions by which you may access and use
            the Interface. 
            <strong className="underline">
              Please read this Agreement carefully.
            </strong>{' '}
            This Agreement applies to you (“You”) as a user of the Interface,
            including all the products, services, tools, and information made
            available on{' '}
            <Link href="/wncg">stake.nine-chronicles.com/wncg</Link>. This
            Agreement contains a mandatory individual arbitration and class
            action/jury trial waiver provision that requires the use of
            arbitration on an individual basis to resolve disputes, rather than
            jury trials or class actions.
          </p>
          <p>
            To use the Interface, you must be able to form a legally binding
            contract online either as an individual or on behalf of a legal
            entity. To that end, you represent that, if you are agreeing to this
            Agreement on behalf of a legal entity, you have the legal authority
            to bind the company or other legal entity to this Agreement and you
            are at least 18 years old or the age of majority where you reside,
            whichever is older, can form a legally binding contract online, and
            have the full, right, power, and authority to enter into and to
            comply with the obligations under this Agreement.
          </p>
          <p>
            You are advised to check this Agreement periodically to familiarize
            yourself with any changes to the terms. We may modify, suspend or
            discontinue the Interface at any time and without notifying you. We
            may also change, update, add or remove provisions of these Terms
            from time to time. We, in our sole discretion, reserve the right to
            make changes to our terms of services. Changes are binding on users
            of the Interface and will take effect immediately upon posting. As a
            user, you agree to be bound by any changes, variations, or
            modifications to our terms of service and your continued use of the
            Interface shall constitute acceptance of any such changes,
            variations, or modifications.
          </p>
          <p>
            By accessing or using the Interface or accessing, using or
            attempting our services, you signify that you have read, understand,
            and agree to be bound by this Agreement and our Privacy Policy in
            its entirety and that you comply with the requirements listed
            herein. If you do not agree, you are not authorized to access or use
            the Interface. In addition, when using some features of the
            Interface, you may be subject to specific additional terms and
            conditions applicable to those features. We note that these Terms
            between you and us do not enumerate or cover all rights and
            obligations of each party, and do not guarantee full alignment with
            needs arising from future development. Therefore, our privacy
            policy, platform rules, guidelines and all other agreements entered
            into separately between you and us are deemed supplementary terms
            that are an integral part of these Terms and shall have the same
            legal effect. Your use of the Interface is deemed your acceptance of
            any supplementary terms too.
          </p>
        </section>

        <section className="section">
          <h2>1. Interface</h2>
          <p>
            The Interface provides access to a decentralized protocol on the
            Ethereum blockchain that allows suppliers of digital assets to
            interact with the Protocol and transact using smart contracts
            (“Smart Contracts”).
          </p>
          <p>
            Using the Protocol may require that you pay a fee on the Ethereum
            network to perform a transaction. You acknowledge and agree that
            Nine Chronicles Ltd has no control over any transactions, the method
            of payment of any transactions, or any actual payments of
            transactions. You must ensure that you have a sufficient balance to
            complete any transaction on the Protocol before initiating such
            transaction.
          </p>
          <p>
            You acknowledge and agree that Nine Chronicles Ltd has no control
            over any transactions over the Protocol, the method of payment of
            any transactions or any actual payments of transactions.
            Accordingly, you must ensure that you have a sufficient balance of
            the applicable cryptocurrency tokens stored at your
            protocol-compatible wallet address (“Cryptocurrency Wallet”) to
            complete any transaction on the Protocol or the Ethereum network
            before initiating such transaction.
          </p>
          <p>
            When used on this Interface, the terms “interest”, “earn”, “yield”,
            “invest” and other similar terms are not meant to be interpreted
            literally. Rather, such terms are being used to draw rough analogies
            between the heavily automated and mostly deterministic operations of
            a decentralized-finance smart contract system and the discretionary
            performance of traditional-finance transactions by people.
          </p>
        </section>

        <section className="section">
          <h2>2. Access</h2>
          <p>
            Access to the Interface is provided “as is” and on an “as available”
            basis only. We do not guarantee that the Interface, or any content
            on it, will always be available or uninterrupted. From time to time,
            access may be interrupted, suspended, or restricted, including
            because of a fault, error, unforeseen circumstances, or because we
            are carrying out planned maintenance.
          </p>
          <p>
            We reserve the right to limit the availability of the Interface to
            any person, geographic area, or jurisdiction we so desire and/or to
            terminate your access to and use of the interface, at any time and
            in our sole discretion.
          </p>
          <p>
            We may remove or amend the content of the Interface at any time.
            However, some of the content may be out of date at any given time
            and we are under no obligation to update it. We do not guarantee
            that the Interface, or any content on it, will be free from errors
            or omissions.
          </p>
          <p>
            We will not be liable to you for any loss or damage you may suffer
            as a result of the Interface being unavailable at any time for any
            reason.
          </p>
        </section>

        <section className="section">
          <h2>3. Eligibility</h2>
          <p>
            To access or use the Interface, you must be able to form a legally
            binding contract with us. Accordingly, you represent that you are at
            least eighteen years old and have the full right, power, and
            authority to enter into and comply with the terms and conditions of
            this Agreement on behalf of yourself and any company or legal entity
            for which you may access or use the Interface. You further represent
            that you are not a citizen, resident, or member of any jurisdiction
            or group that is subject to economic sanctions, or where your use of
            the Interface would be illegal or otherwise violate any applicable
            law. You further represent that your access and use of the Interface
            will fully comply with all applicable laws and regulations, and that
            you will not access or use the Interface to conduct, promote, or
            otherwise facilitate any illegal activity, including but not limited
            to regulations on anti-money laundering, anti-corruption, and
            counter-terrorist financing. You further represent that you have not
            been included in any trade embargoes or economic sanctions list, the
            list of specially designated nationals maintained by OFAC, or the
            denied persons or entity list of the U.S. Department of Commerce,
            nor you have been a subject or target of any other economic
            sanctions administered or enforced by the United Nations, the
            European Union or the United Kingdom. You further represent that you
            have not been previously suspended or removed from using the
            Interface. If you act as an employee or agent of a legal entity, and
            enter into these Terms on their behalf, you represent and warrant
            that you have all the necessary rights and authorizations to bind
            such legal entity. You are solely responsible for use of the
            Interface and, if applicable, for all activities that occur on or
            through your user account.
          </p>
        </section>

        <section className="section">
          <h2>4. Modification of this Agreement</h2>
          <p>
            We reserve the right, in our sole discretion, to modify this
            Agreement from time to time. If we make any modifications, we will
            notify you by updating the date at the top of the Agreement and by
            maintaining a current version of the Agreement at 
            <Link href="/docs/terms">
              https://stake.nine-chronicles.com/docs/terms
            </Link>
            . All modifications will be effective when they are posted, and your
            continued use of the Interface will serve as confirmation of your
            acceptance of those modifications. If you do not agree with any
            modifications to this Agreement, you must immediately stop accessing
            and using the Interface.
          </p>
        </section>

        <section className="section">
          <h2>5. Proprietary Rights</h2>
          <p>
            The HTML and other software code and text used in the Interface is
            available on GitHub and is freely licensed under MIT License. The
            protocol is comprised entirely of open-source software running on
            the public Ethereum blockchain and is not our proprietary property.
          </p>
        </section>

        <section className="section">
          <h2>6. Marks, Logos and Branding</h2>
          <p>
            All Nine Chronicles-related marks, logos, and branding used on the
            Interface can be freely used for the expansion of Nine Chronicles
            ecosystem. It needs consultation with us if it is used for
            commercial usage unrelated to Nine Chronicles ecosystem. All other
            marks, logos and branding appearing on the Interface (including
            token names, symbols and logos that may be identified on the
            Interface) are the property of their respective owners.
          </p>
        </section>

        <section className="section">
          <h2>7. Privacy</h2>
          <p>
            The Privacy Policy describes the ways we collect, use, store and
            disclose your personal information. You agree to the collection,
            use, storage, and disclosure of your data in accordance with the
            Privacy Policy. You acknowledge that no data transmission over the
            internet is totally secure. Accordingly, we cannot warrant the
            security of any information which you transmit to us. While we do
            use certain physical, organizational, and technical safeguards that
            are designed to maintain the integrity and security of information
            that we collect, we cannot guarantee that unauthorized third parties
            will never be able to obtain or use your data or aggregate data for
            improper purposes. By accessing and using the Interface, you
            acknowledge that we are not responsible for any of these variables
            or risks, do not own or control the Protocol, and cannot be held
            liable for any improperly accessed data, whether resulting in losses
            that you experience while accessing or using the Interface or
            otherwise.
          </p>
        </section>

        <section className="section">
          <h2>8. Prohibited Activity</h2>
          <p>
            You agree not to engage in, or attempt to engage in, any of the
            following categories of prohibited activity in relation to your
            access and use of the Interface:
          </p>
          <ul>
            <li>
              <strong className="underline">
                Dishonesty and Violation of Law. You shall not use the Interface
                in any dishonest or unlawful manner, for fraudulent or malicious
                activities, or in any manner inconsistent with these Terms or
                violate applicable laws or regulations in any manner.
              </strong>
            </li>
            <li>
              <strong className="underline">
                Intellectual Property Infringement.
              </strong>{' '}
              Activity that infringes on or violates any copyright, trademark,
              service mark, patent, right of publicity, right of privacy, or
              other proprietary or intellectual property rights under the law.
            </li>
            <li>
              <strong className="underline">Cyberattack.</strong> Activity that
              seeks to interfere with or compromise the integrity, security, or
              proper functioning of any computer, server, network, personal
              device, or other information technology system, including (but not
              limited to) the deployment of viruses and denial of service
              attacks.
            </li>
            <li>
              <strong className="underline">
                Fraud and Misrepresentation.
              </strong>{' '}
              Activity that seeks to defraud us or any other person or entity,
              including (but not limited to) providing any false, inaccurate, or
              misleading information in order to unlawfully obtain the property
              of another.
            </li>
            <li>
              <strong className="underline">Market Manipulation.</strong>{' '}
              Activity that violates any applicable law, rule, or regulation
              concerning the integrity of trading markets, including (but not
              limited to) the manipulative tactics commonly known as spoofing
              and wash trading.
            </li>
            <li>
              <strong className="underline">Other Harmful Acts.</strong>{' '}
              Attempts to engage in or engage in, any potentially harmful acts
              that are directed against Nine Chronicles Ltd, including but not
              limited to violating or attempting to violate any security
              features of Nine Chronicles Ltd, using manual or automated
              software or other means to access, “scrape,” “crawl” or “spider”
              any pages contained in or on the Interface, introducing viruses,
              worms, or similar harmful code into the Interface, or interfering
              or attempting to interfere with use of the Interface by any other
              user, host or network, including by means of overloading,
              “flooding,” “spamming,” “mail bombing,” or “crashing” the
              Interface or any other Nine Chronicles Ltd, properties.
            </li>
            <li>
              <strong className="underline">Any Other Unlawful Conduct.</strong>{' '}
              Activity that violates any applicable Law, including, without
              limitation, any relevant and applicable anti-money laundering and
              anti-terrorist financing laws and any relevant and applicable
              privacy and data collection laws, in each case as may be amended.
            </li>
          </ul>
        </section>

        <section className="section">
          <h2>9. No Professional Advice</h2>
          <p>
            All information provided by the Interface is for informational
            purposes only and should not be construed as professional advice. In
            particular, the content and materials available on the Interface
            does not constitute any form of advice or recommendation by us,
            should not be regarded as an offer, solicitation, invitation or
            recommendation to buy or sell investments, securities or any other
            financial services and is not intended to be relied upon by you in
            making any specific investment or other decisions. We do not give
            investment advice, endorsement, analysis or recommendations with
            respect to any cryptocurrencies, digital assets, tokens, NFTs or
            securities or provide any financial, tax, legal advice or
            consultancy services of any kind. We are not your broker,
            intermediary, agent, or advisor and has no fiduciary relationship or
            obligation to you in connection with any trades or other decisions
            or activities effected by you using the platform. The Interface has
            not been approved by any regulator and is for “professional
            investors”, “accredited investors” or “sophisticated investors”
            only. You should not take, or refrain from taking, any action based
            on any information contained in the Interface. Before you make any
            financial, legal, or other decisions involving the Interface, you
            should seek independent professional advice from an individual who
            is licensed and qualified in the area for which such advice would be
            appropriate. We encourage you to consult your professional advisers
            in respect of any decisions or activities made on the Interface.
          </p>
          <p>
            Nothing included in the Interface constitutes an offer or
            solicitation to sell, or distribution of, investments and related
            services to anyone in any jurisdiction.
          </p>
          <p>
            From time to time, reference may be made to data we have gathered.
            These references may be selective or, may be partial. As markets
            change continuously, previously published information and data may
            not be current and should not be relied upon.
          </p>
          <p>
            Any reference to any Rate on the Interface is for informational
            purposes only. The Rate is a forward-looking projection based on a
            good faith belief of how to reasonably project results over the
            relevant period, but such belief is subject to numerous assumptions,
            risks and uncertainties (including smart contract security risks and
            third-party actions) which could result in a materially different
            (lower or higher) token-denominated Rate.
          </p>
          <p>
            The Rate is not a promise, guarantee, or undertaking on the part of
            any person or group of persons, but depends entirely on the results
            of operation of smart contracts and other autonomous systems
            (including third-party systems) and how third parties interact with
            those systems after the time of your deposit.
          </p>
          <p>
            Even if the Rate is achieved as projected, you may still suffer a
            financial loss in fiat-denominated terms if the fiat-denominated
            value of the relevant tokens (your deposit and any tokens allocated
            or distributed to you pursuant to the Rate) declines during the
            deposit period.
          </p>
          <p>
            You are recommended to exercise prudence and use the platform
            responsibly within your own capabilities. You are solely responsible
            for determining whether any action or transaction is appropriate for
            you according to your personal investment objectives, financial
            circumstances and risk tolerance, and you shall be solely
            responsible for any loss or liability therefrom. You should consult
            legal or tax professionals regarding your specific situation. We do
            not recommend that any digital assets should be minted, burnt,
            bought, earned, sold, or held by you and we will not be held
            responsible for the decisions you make based on the information
            provided on the Interface.
          </p>
        </section>

        <section className="section">
          <h2>10. Third-Party Links</h2>
          <p>
            The Interface may contain hyperlinks or references to third party
            websites. Any such hyperlinks or references are provided for your
            information and convenience only. We have no control over third
            party websites and accept no legal responsibility for any content,
            material or information contained in them. The display of any
            hyperlink and reference to any third-party website does not mean
            that we endorse that third party’s website, products or services.
            Your use of a third-party site may be governed by the terms and
            conditions of that third-party site.
          </p>
        </section>

        <section className="section">
          <h2>11. No Warranties</h2>
          <p>
            The Interface is provided on an “AS IS” and “AS AVAILABLE” basis. To
            the fullest extent permitted by law, we disclaim any representations
            and warranties of any kind, whether express, implied, or statutory,
            including (but not limited to) the warranties of merchantability and
            fitness for a particular purpose. You acknowledge and agree that
            your use of the Interface is at your own risk. We do not represent
            or warrant that access to the Interface will be continuous,
            uninterrupted, timely, or secure; that the information contained in
            the Interface will be accurate, reliable, complete, or current; or
            that the Interface will be free from errors, defects, viruses, or
            other harmful elements. No advice, information, or statement that we
            make should be treated as creating any warranty concerning the
            Interface. We do not endorse, guarantee, or assume responsibility
            for any advertisements, offers, or statements made by third parties
            concerning the Interface.
          </p>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WE SPECIFICALLY
            DISCLAIMS ANY IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY, FITNESS
            FOR A PARTICULAR PURPOSE AND/OR NON-INFRINGEMENT. WE DO NOT MAKE ANY
            REPRESENTATIONS OR WARRANTIES THAT ACCESS TO THE INTERFACE, ANY PART
            OF THE SERVICES, INCLUDING MOBILE SERVICES, OR ANY OF THE MATERIALS
            CONTAINED THEREIN, WILL BE CONTINUOUS, UNINTERRUPTED, TIMELY, OR
            ERROR-FREE AND WILL NOT BE LIABLE FOR ANY LOSSES RELATING THERETO.
            WE DO NOT REPRESENT OR WARRANT THAT THE INTERFACE, THE SERVICES OR
            ANY MATERIALS ARE ACCURATE, COMPLETE, RELIABLE, CURRENT, ERROR-FREE,
            OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
          </p>
        </section>

        <section className="section">
          <h2>12. No Fiduciary Duties</h2>
          <p>
            This Agreement is not intended to, and does not, create or impose
            any fiduciary duties on us. To the fullest extent permitted by law,
            you acknowledge and agree that we owe no fiduciary duties or
            liabilities to you or any other party, and that to the extent any
            such duties or liabilities may exist at law or in equity, those
            duties and liabilities are hereby irrevocably disclaimed, waived,
            and eliminated. You further agree that the only duties and
            obligations that we owe you are those set out expressly in this
            Agreement.
          </p>
        </section>

        <section className="section">
          <h2>13. Assumption of Risk</h2>
          <p>
            By accessing and using the Interface, you represent that you
            understand the inherent risks associated with using cryptographic
            and blockchain-based systems, and that you have a working knowledge
            of the usage and intricacies of digital assets. You further
            understand that the markets for these digital assets are highly
            volatile due to factors including (but not limited to) adoption,
            speculation, technology, security, and regulation. We do not provide
            investment advice and any content contained on the Interface should
            not be considered as a substitute for tailored investment advice.
            Investing in digital assets is highly risky and may lead to a total
            loss of investment. You must have sufficient understanding of
            cryptographic tokens, token storage mechanisms (such as token
            wallets), and blockchain technology to appreciate the risks involved
            in dealing in digital assets. You acknowledge that the cost and
            speed of transacting with cryptographic and blockchain-based systems
            are variable and may increase dramatically at any time. You further
            acknowledge the risk that your digital assets may lose some or all
            of their value while they are deposited to the Protocol. You further
            acknowledge that we are not responsible for any of these variables
            or risks, do not own or control the Protocol, and cannot be held
            liable for any resulting losses that you experience while accessing
            or using the Interface. You understand and agree that the value of
            digital assets can be volatile, and we are not in any way
            responsible or liable for any losses you may incur by using or
            transferring digital assets in connection with the Interface.
          </p>
          <p>
            We make no warranties as to the markets on which digital assets are
            transferred, purchased, or traded. You are solely responsible for
            determining what, if any, taxes apply to your digital asset
            transactions. We are not responsible for determining the taxes that
            apply to your transactions.
          </p>
          <p>
            We do not store, send, or receive digital assets or funds. This is
            because digital assets exist only by virtue of the ownership record
            maintained on its supporting blockchain. Any transfer of digital
            assets occurs within the decentralized Protocol and Ethereum
            blockchain and not in the Interface. We cannot assist you to cancel
            or otherwise modify any transaction or transaction details. There
            are no warranties or guarantees that a transfer initiated via the
            Interface will successfully transfer title or right in any digital
            asset.
          </p>
          <p>
            Accordingly, you understand and agree to assume full responsibility
            for all of the risks of accessing and using the Interface and
            interacting with the Protocol.
          </p>
        </section>

        <section className="section">
          <h2>14. Release of Claims</h2>
          <p>
            You expressly agree that you assume all risks in connection with
            your access and use of the Interface and your interaction with the
            Protocol. You further expressly waive and release us from any and
            all liability, claims, causes of action, or damages arising from or
            in any way relating to your use of the Interface and your
            interaction with the Protocol. If you are a California resident, you
            waive the benefits and protections of California Civil Code § 1542,
            which provides: “[a] general release does not extend to claims that
            the creditor or releasing party does not know or suspect to exist in
            his or her favor at the time of executing the release and that, if
            known by him or her, would have materially affected his or her
            settlement with the debtor or released party.”
          </p>
        </section>

        <section className="section">
          <h2>15. Indemnity</h2>
          <p>
            You agree to hold harmless, release, defend, and indemnify us and
            our officers, directors, employees, contractors, agents, affiliates,
            and subsidiaries from and against all claims, damages, obligations,
            losses, liabilities, costs, and expenses arising from: (a) your
            access and use of the Interface; (b) your violation of any laws,
            regulations, term or condition of this Agreement, the right of any
            third party, or any other applicable law, rule, or regulation; and
            (c) any other party’s access and use of the Interface with your
            assistance or using any device or account that you own or control.
          </p>
        </section>

        <section className="section">
          <h2>16. Limitation of Liability</h2>
          <p>
            Under no circumstances shall we or any of our officers, directors,
            employees, contractors, agents, affiliates, or subsidiaries be
            liable to you for any indirect, punitive, incidental, special,
            consequential, or exemplary damages, including (but not limited to)
            damages for loss of profits, goodwill, use, data, or other
            intangible property, arising out of or relating to any access or use
            of the Interface, nor will we be responsible for any damage, loss,
            or injury resulting from hacking, tampering, or other unauthorized
            access or use of the Interface or the information contained within
            it. We assume no liability or responsibility for any: (a) errors,
            mistakes, or inaccuracies of content; (b) personal injury or
            property damage, of any nature whatsoever, resulting from any access
            or use of the Interface; (c) unauthorized access or use of any
            secure server or database in our control, or the use of any
            information or data stored therein; (d) interruption or cessation of
            function related to the Interface; (e) bugs, viruses, trojan horses,
            or the like that may be transmitted to or through the Interface; (f)
            errors or omissions in, or loss or damage incurred as a result of
            the use of, any content made available through the Interface; (g)
            the defamatory, offensive, or illegal conduct of any third party;
            and (h) any performance of non-performance of any services or
            product on the Interface. Under no circumstances shall we or any of
            our officers, directors, employees, contractors, agents, affiliates,
            or subsidiaries be liable to you for any claims, proceedings,
            liabilities, obligations, damages, losses, or costs in an amount
            exceeding the amount you paid to us in exchange for access to and
            use of the Interface, or $100.00, whichever is greater. This
            limitation of liability applies regardless of whether the alleged
            liability is based on contract, tort, negligence, strict liability,
            or any other basis, and even if we have been advised of the
            possibility of such liability. Some jurisdictions do not allow the
            exclusion of certain warranties or the limitation or exclusion of
            certain liabilities and damages. Accordingly, some of the
            disclaimers and limitations set forth in this Agreement may not
            apply to you. This limitation of liability shall apply to the
            fullest extent permitted by law.
          </p>
        </section>

        <section className="section">
          <h2>17. Dispute Resolution</h2>
          <p>
            We will use our best efforts to resolve any potential disputes
            through informal, good faith negotiations. If a potential dispute
            arises, you must contact us by sending an email to
            <a
              href="mailto:legal@nine-chronicles.com"
              target="_blank"
              rel="noreferrer"
            >
              legal@nine-chronicles.com
            </a>{' '}
            so that we can attempt to resolve it without resorting to formal
            dispute resolution. If we aren’t able to reach an informal
            resolution within sixty days of your email, then you and we both
            agree to resolve the potential dispute according to the process set
            forth below.
          </p>
          <p>
            Any dispute, controversy, difference or claim arising out of or in
            connection with the Interface, this Agreement, including any
            question regarding its existence, validity, interpretation,
            performance, breach or termination thereof or any dispute regarding
            non-contractual obligations arising out of or relating thereto,
            shall be referred to and finally resolved by arbitration
            administered by the British Virgin Islands International Arbitration
            Centre (“BVIIAC”) under the BVIIAC Administered Arbitration Rules
            (“Rules”) in force when the Notice of Arbitration (as defined in the
            Rules) is submitted.
          </p>
        </section>

        <section className="section">
          <h2>18. Class Action and Jury Trial Waiver</h2>
          <p>
            You must bring any and all Disputes against us in your individual
            capacity and not as a plaintiff in or member of any purported class
            action, collective action, private attorney general action, or other
            representative proceeding. This provision applies to class
            arbitration. You and we both agree to waive the right to demand a
            trial by jury.
          </p>
        </section>

        <section className="section">
          <h2>19. Governing Law</h2>
          <p>
            You agree that the laws of the British Virgin Islands, without
            regard to principles of conflict of laws, govern this Agreement and
            any Dispute between you and us. You further agree that the Interface
            shall be deemed to be based solely in British Virgin Islands, and
            that although the Interface may be available in other jurisdictions,
            its availability does not give rise to general or specific personal
            jurisdiction in any forum outside of British Virgin Islands.
          </p>
        </section>

        <section className="section">
          <h2>20. Miscellaneous</h2>
          <p>
            We may perform any of our obligations, and exercise any of the
            rights granted to us under this Agreement, through a third-party. We
            may assign any or all our rights and obligations under this
            Agreement to any third-party.
          </p>
          <p>
            If any clause or part of any clause of this Agreement is found to be
            void, unenforceable or invalid, then it will be severed from this
            Agreement, leaving the remainder in full force and effect, provided
            that the severance has not altered the basic nature of this
            Agreement.
          </p>
          <p>
            No single or partial exercise, or failure or delay in exercising any
            right, power or remedy by us shall constitute a waiver by us of, or
            impair or preclude any further exercise of, that or any right, power
            or remedy arising under these terms and conditions or otherwise.
          </p>
          <p>
            If any of the provisions in this Agreement is found to be illegal,
            invalid or unenforceable by any court of competent jurisdiction, the
            remainder shall continue in full force and effect.
          </p>
          <p>
            All disclaimers, indemnities and exclusions in this Agreement shall
            survive termination of the Agreement and shall continue to apply
            during any suspension or any period during which the Interface is
            not available for you to use for any reason whatsoever.
          </p>
        </section>

        <section className="section">
          <h2>21. Contacting Us</h2>
          <p>
            As stated in Section 13, Assumption of Risk, we do not have custody
            of or access to users’ digital assets or funds. As a result, please
            be very careful when using the protocol, as there is no way for us
            to assist you with canceling or otherwise modifying any transaction
            or transaction details. If you are having an issue or have a
            technical question regarding the protocol, you can seek the
            assistance of community contributors by opening a support ticket and
            describing your issue on the discord channel linked here 
            <a
              href="https://discord.com/invite/planetarium"
              target="_blank"
              rel="noreferrer"
            >
              https://discord.com/invite/planetarium
            </a>
            .
          </p>
        </section>
      </div>

      <GlobalHooks />
    </StyledDocsPage>
  )
}

export default Terms
