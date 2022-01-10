const findAndNukeWebhooks = () => {
    const body = document.body.outerText;
    const regexp = /https?:\/\/(?:ptb.|canary.|www.|)discord(?:app)?.com\/api\/webhooks\/([0-9]{17,20})\/([a-z0-9\.\-\_]{60,68})/gi;
    
    const matches = [...body.matchAll(regexp)];
    
    matches.forEach((match) => {
        const URI = match[0];
        
        fetch(URI, {
            method: 'DELETE',
        }).then((r) => {
            if (r.status === 204) {
                console.log(`DELETED`);
                incrementDeletedCount();

            } else if (r.status === 404) {
                console.log(`ALREADY DELETED`);
            } else {
                console.log(r);
            }
        }).catch(() => {
            // err
        });
    });
    
}

const incrementDeletedCount = ()  => {
    chrome.storage.local.get(['webhookdeletes'], function(result) {
        const newValue = result.webhookdeletes ? result.webhookdeletes + 1 : 1;

        chrome.storage.local.set({webhookdeletes: newValue});

        console.log(`Total webhooks nuked is now ${newValue}`);
    });      
}

document.onkeydown = (e) => {
    console.log(e);
    if (e.key === 'Delete')
        findAndNukeWebhooks();
}