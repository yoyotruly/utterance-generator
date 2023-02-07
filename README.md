# Utterance Generator Design Review

## Table of Content

- [Feature in Focus](#feature-in-focus)
- [Customer Segment](#customer-segment)
- [Feature Offering](#feature-offering)
- [Improvement Ideas](#improvement-ideas)
- [Architecture Implementation](#architecture-implementation)

## Feature in Focus

Utterance Generation in AI Assist

## Customer Segment

Conversation Designers

## Feature Offering

Auto utterance generation:

1. provides inspiration to conversation designers and helps them to overcome writer's block
2. saves time in the most dreaded area of the design process and kickstarts prototype sooner
3. reduces repetitive tasks and allows designers can focus on high value-add aspects

## Improvement Ideas

### Idea 0. Quick Win - UI Fix

**_Situation_**

Generated utterances don't change as user changes intent. This could create unintended conflicts down the road.

**_Suggestion_**

Fix generated utterances state management. Attach unique intent ID to its state.

### Idea 1. Short Term - Add Context to Increase Response Variety (w/ Demo)

**_Situation_**

Currently the prompt used to generate utterances is only based on parsed intent. As a result, results tend to lack variety.

**_Suggestion_**

Allow designers to provide context tags in addition to intent. These context can then be used as additional keywords in the prompt when generating utterances.

### Idea 2. Medium Term - Pre-fetch Results for Common Intent to Reduce Latency and Cost

**_Situation_**

- Expensive API call each time user clicks on generate
- Throughput and availability rely on Open AI's service
- Currently not fully leveraging user feedback data
- Can't foresee result duplications

**_Suggestion_**

Add an additional step to pre-fetch a large number of results for a common set of intent. This step can be scheduled as a batch job, so we can afford slow reponse with large payloads. We can further increase the variety of responses by getting results from different text models. Curated user feedback data (e.g. which utterances are good and which ones are bad) can be used as additional examples in the prompt to fine-tune the model.

We can also perform additional preprocessing on the results to further control the response quality, e.g. deduplication.

For existing intent, we can pre-compute the embeddings and assign a cluster ID if they belong to the common set. When user clicks on the generate button, instead of sending the request to external API, the server will instead fetch recommendations from the database.

For new intent, as the request comes in, a process needs to classify if it belongs to any cluster. If yes, then the request follows the same flow as above. If not, it gets sent to ML Gateway.

### Idea 3. Long Term - Add Autocompletion Suggestion to Further Empower Designers

**_Suggestion_**

Implement an autocomplete/typeahead system similar to Gmail, further integrating AI Assist into users' workflow. As designers type, if similar sentences exist, a prompt can show up to allow tab completion. This autocompletion feature can be implemented to assist utterance writing, as well as intent and context.

**_Constraints_**

- Data availability
- Cross org data sharing

### Bonus Idea. Add Multilingual Support

## Architecture Implementation

[TODO: insert diagram]
