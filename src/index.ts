const instance_skel = require('../../../instance_skel')
import { InstanceConfig, configFields } from './inputs/config-fields'
import * as actions from './inputs/actions'
import { GraphQLClient } from 'graphql-request'
import { getSdk, Source } from 'linkbox-sdk'
import { ActionType, getActions } from './inputs/actions'
import { FeedbackType, getFeedbacks } from './inputs/feedbacks'

class Linkbox extends instance_skel {
	private debug
	private client
	private recorders: { [sourceId: string]: { isRecording: boolean } } = {}
	private sources: Source[] = []

	constructor(system, id, config: InstanceConfig) {
		super(system, id, config)
		Object.assign(this, { ...actions })

		if (config) {
			this.init(config)
		}
	}

	public setupActions() {
		this.setActions(getActions(this.sources))
	}

	public config_fields() {
		return configFields
	}

	private initializeApiClient(config: InstanceConfig): void {
		const { apiToken, apiUrl } = config
		const gqlClient = new GraphQLClient(apiUrl, {
			headers: { authorization: `Bearer ${apiToken}` },
		})
		this.client = getSdk(gqlClient)
	}

	private async syncSources(): Promise<void> {
		const { sources } = await this.client.sources()
		this.sources = sources.filter((source: Source) => source['__typename'] === 'InterfaceSource')
	}

	public async action({ action, options }) {
		switch (action) {
			case ActionType.StartRecording:
				const { sourceId } = options
				try {
					this.recorders[sourceId] = { isRecording: true }
					this.checkFeedbacks(FeedbackType.Recording)
				} catch (error) {
					this.debug('Can not start recording' + error)
				}
				break
		}
	}

	public destroy() {
		this.debug('destroy', this.id)
		this.stopTimer()
	}

	async init(config: InstanceConfig) {
		if (!config) {
			this.debug('skip initialization because there is no config')
			return
		}
		this.initializeApiClient(config)
		await this.syncSources()

		this.setupActions()
		this.setFeedbackDefinitions(getFeedbacks(this, this.sources))
		this.initTimer()
		this.status(this.STATE_OK)
	}

	public updateConfig(config: InstanceConfig) {
		this.config = config
		this.init(config)
	}

	public feedback(feedback) {
		const {
			options: { sourceId },
		} = feedback
		if (feedback.type === FeedbackType.Recording) {
			if (this.recorders[sourceId].isRecording) {
				return {
					color: feedback.options.fg,
					bgcolor: feedback.options.bg,
				}
			}
		}
		return {}
	}

	private initTimer() {
		if (!this.Timer) {
			const poll = async () => {
				Object.keys(this.recorders).forEach(async (sourceId) => {
					const { isRecording } = await this.client.isRecording({
						where: { id: sourceId },
					})
					this.recorders[sourceId].isRecording = isRecording
					this.checkFeedbacks(FeedbackType.Recording, { foo: 'bar' })
				})
			}
			this.Timer = setInterval(() => poll(), 5000)
			this.checkFeedbacks(FeedbackType.Recording)
		}
	}

	private stopTimer() {
		if (this.Timer) {
			clearInterval(this.Timer)
			delete this.Timer
		}
	}
}

export = Linkbox
