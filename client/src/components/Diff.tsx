import { diffWords, Change } from "diff";

const styles = {
	removed: `color: green; background-color: #b5efdb;`,
	added: `color: red; background-color: #fec4c0;`,
	nochange: ``,
};

export const GenerateDiff = (text: string, correction: string) => {
	const groups: Change[] = diffWords(text, correction);

	const mappedNodes = groups.map(group => {
		const { value, added, removed } = group;

		const style = styles[added ? 'added' : (removed ? 'removed' : 'nochange')];
		return `<span style="${style}">${value}</span>`;
	});

	return mappedNodes.join(" ");
};
