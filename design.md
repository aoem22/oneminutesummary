OK, we're launching the 1 minute summarizer website. The mission of the website is to take youtube links as input, and output a summary that 1 minute long. 

You can see the interface from the picture. 

Here are the steps: 
Download the audio from the youtube link. 
Run the audio through a speech recognition model to get the transcript, like openai whisper. 
Take the transcript, and run it through a gpt4o model to get a summary with own prompt. 
Display summary in the summary section. 
