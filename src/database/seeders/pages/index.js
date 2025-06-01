import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import fs from 'fs'
import path from 'path'

async function getPages() {
  const [cookiePolicy, privacyTitle, bonusTitle, TermsAndCondition, responsibleGamblingTitle, sweepStackRules] = await Promise.all([
    getLanguageWiseNameJson({ EN: 'Cookie Policy' }),
    getLanguageWiseNameJson({ EN: 'Privacy Policy' }),
    getLanguageWiseNameJson({ EN: 'Bonus Terms' }),
    getLanguageWiseNameJson({ EN: 'Terms & Conditions' }),
    getLanguageWiseNameJson({ EN: 'Responsible Gambling' }),
    getLanguageWiseNameJson({EN: 'Sweep Stack Rules'})
  ])
  const [cookieContent, privacyContent, bonusContent, generalContent, responsibleGamblingContent, sweepStackRulesContent] = await Promise.all(
    [getLanguageWiseNameJson({ EN: fs.readFileSync(path.join(__dirname, './cookiePolicy.html')).toString() }),
    getLanguageWiseNameJson({ EN: fs.readFileSync(path.join(__dirname, './privacyPolicy.html')).toString() }),
    getLanguageWiseNameJson({ EN: fs.readFileSync(path.join(__dirname, './bonusTerms.html')).toString() }),
    getLanguageWiseNameJson({ EN: fs.readFileSync(path.join(__dirname, './generalTerms.html')).toString() }),
    getLanguageWiseNameJson({ EN: fs.readFileSync(path.join(__dirname, './responsibleGambling.html')).toString() }),
    getLanguageWiseNameJson({EN: fs.readFileSync(path.join(__dirname, './sweepStackRules.html')).toString()}),
    ])
    
  const pages = [{
    slug: 'cookie-policy',
    title: JSON.stringify(cookiePolicy),
    content: JSON.stringify(cookieContent)
  }, {
    slug: 'privacy-policy',
    title: JSON.stringify(privacyTitle),
    content: JSON.stringify(privacyContent)
  }, {
    slug: 'bonus-terms',
    title: JSON.stringify(bonusTitle),
    content: JSON.stringify(bonusContent)
  }, {
    slug: 'termsandcondition',
    title: JSON.stringify(TermsAndCondition),
    content: JSON.stringify(generalContent)
  }, {
    slug: 'responsible-gambling',
    title: JSON.stringify(responsibleGamblingTitle),
    content: JSON.stringify(responsibleGamblingContent)
  }, {
    slug: 'sweepstackrules',
    title: JSON.stringify(sweepStackRules),
    content: JSON.stringify(sweepStackRulesContent)
  }]
 
  return pages
}

export { getPages }


