import { msg } from '@lingui/core/macro';
import { i18nLabel } from 'src/engine/workspace-manager/integracore-standard-application/utils/i18n-label.util';
import { STANDARD_OBJECTS } from 'integracore-shared/metadata';
import {
  DateDisplayFormat,
  FieldMetadataType,
  RelationOnDeleteAction,
  RelationType,
} from 'integracore-shared/types';

import { createStandardMorphRelationHeadFlatMetadata } from 'src/engine/workspace-manager/integracore-standard-application/utils/field-metadata/create-standard-morph-relation-head-flat-metadata.util';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type AllStandardObjectFieldName } from 'src/engine/workspace-manager/integracore-standard-application/types/all-standard-object-field-name.type';
import {
  createStandardFieldFlatMetadata,
  type CreateStandardFieldArgs,
} from 'src/engine/workspace-manager/integracore-standard-application/utils/field-metadata/create-standard-field-flat-metadata.util';
import { createStandardRelationFieldFlatMetadata } from 'src/engine/workspace-manager/integracore-standard-application/utils/field-metadata/create-standard-relation-field-flat-metadata.util';
export const buildTimelineActivityStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  integracoreStandardApplicationId,
}: Omit<
  CreateStandardFieldArgs<'timelineActivity', FieldMetadataType>,
  'context'
>): Record<
  AllStandardObjectFieldName<'timelineActivity'>,
  FlatFieldMetadata
> => ({
  id: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'id',
      type: FieldMetadataType.UUID,
      label: i18nLabel(msg({ message: `ID`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({ message: `ID`, context: 'fieldMetadata.description' }),
      ),
      icon: 'Icon123',
      isSystem: true,
      isNullable: false,
      isUIEditable: false,
      defaultValue: 'uuid',
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  createdAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'createdAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Creation date`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({ message: `Creation date`, context: 'fieldMetadata.description' }),
      ),
      icon: 'IconCalendar',
      isSystem: true,
      isNullable: false,
      isUIEditable: false,
      defaultValue: 'now',
      settings: { displayFormat: DateDisplayFormat.RELATIVE },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  updatedAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'updatedAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Last update`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Last time the record was changed`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCalendarClock',
      isSystem: true,
      isNullable: false,
      isUIEditable: false,
      defaultValue: 'now',
      settings: { displayFormat: DateDisplayFormat.RELATIVE },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  deletedAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'deletedAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Deleted at`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Date when the record was deleted`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCalendarMinus',
      isSystem: true,
      isNullable: true,
      isUIEditable: false,
      settings: { displayFormat: DateDisplayFormat.RELATIVE },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  createdBy: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'createdBy',
      type: FieldMetadataType.ACTOR,
      label: i18nLabel(
        msg({ message: `Created by`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `The creator of the record`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCreativeCommonsSa',
      isSystem: true,
      isUIEditable: false,
      isNullable: false,
      defaultValue: {
        source: "'MANUAL'",
        name: "'System'",
        workspaceMemberId: null,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  updatedBy: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'updatedBy',
      type: FieldMetadataType.ACTOR,
      label: i18nLabel(
        msg({ message: `Updated by`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `The workspace member who last updated the record`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUserCircle',
      isSystem: true,
      isUIEditable: false,
      isNullable: false,
      defaultValue: {
        source: "'MANUAL'",
        name: "'System'",
        workspaceMemberId: null,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  position: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'position',
      type: FieldMetadataType.POSITION,
      label: i18nLabel(
        msg({ message: `Position`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Timeline activity record position`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconHierarchy2',
      isSystem: true,
      isNullable: false,
      defaultValue: 0,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  happensAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'happensAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Creation date`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({ message: `Creation date`, context: 'fieldMetadata.description' }),
      ),
      icon: 'IconCalendar',
      isNullable: false,
      isUIEditable: false,
      defaultValue: 'now',
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  timelineActivityTypeId: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'timelineActivityTypeId',
      type: FieldMetadataType.UUID,
      label: i18nLabel(
        msg({ message: `Event type`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Timeline activity type describing this event`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconAbc',
      isSystem: true,
      isNullable: true,
      isUIEditable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  timelineActivityTypeSnapshot: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'timelineActivityTypeSnapshot',
      type: FieldMetadataType.RAW_JSON,
      label: i18nLabel(
        msg({ message: `Event type`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Timeline activity type describing this event`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconArchive',
      isSystem: true,
      isNullable: true,
      isUIEditable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  properties: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'properties',
      type: FieldMetadataType.RAW_JSON,
      label: i18nLabel(
        msg({ message: `Event details`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `JSON value for event details`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconListDetails',
      isNullable: true,
      isUIEditable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  linkedRecordCachedName: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'linkedRecordCachedName',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
        msg({
          message: `Linked Record cached name`,
          context: 'fieldMetadata.label',
        }),
      ),
      description: i18nLabel(
        msg({
          message: `Cached record name`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconAbc',
      isSystem: true,
      isNullable: true,
      isUIEditable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  linkedRecordId: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'linkedRecordId',
      type: FieldMetadataType.UUID,
      label: i18nLabel(
        msg({ message: `Linked Record id`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Linked Record id`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconAbc',
      isSystem: true,
      isNullable: true,
      isUIEditable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  linkedObjectMetadataId: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'linkedObjectMetadataId',
      type: FieldMetadataType.UUID,
      label: i18nLabel(
        msg({
          message: `Linked Object Metadata ID`,
          context: 'fieldMetadata.label',
        }),
      ),
      description: i18nLabel(
        msg({
          message: `Linked Object Metadata ID`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconAbc',
      isSystem: true,
      isNullable: true,
      isUIEditable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),

  workspaceMember: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'workspaceMember',
      label: i18nLabel(
        msg({ message: `Workspace Member`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Event workspace member`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUsers',
      isNullable: true,
      isUIEditable: false,
      targetObjectName: 'workspaceMember',
      targetFieldName: 'timelineActivities',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'workspaceMemberId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  target: createStandardMorphRelationHeadFlatMetadata({
    objectName,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  targetPerson: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.MORPH_RELATION,
      morphId: STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
      fieldName: 'targetPerson',
      label: i18nLabel(
        msg({ message: `Person`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({ message: `Event target`, context: 'fieldMetadata.description' }),
      ),
      icon: 'IconTimelineEvent',
      isNullable: true,
      isUIEditable: false,
      isSystemSideEffect: true,
      targetObjectName: 'person',
      targetFieldName: 'timelineActivities',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'targetPersonId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  targetCompany: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.MORPH_RELATION,
      morphId: STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
      fieldName: 'targetCompany',
      label: i18nLabel(
        msg({ message: `Company`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({ message: `Event target`, context: 'fieldMetadata.description' }),
      ),
      icon: 'IconTimelineEvent',
      isNullable: true,
      isUIEditable: false,
      isSystemSideEffect: true,
      targetObjectName: 'company',
      targetFieldName: 'timelineActivities',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'targetCompanyId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  targetOpportunity: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.MORPH_RELATION,
      morphId: STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
      fieldName: 'targetOpportunity',
      label: i18nLabel(
        msg({ message: `Opportunity`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({ message: `Event target`, context: 'fieldMetadata.description' }),
      ),
      icon: 'IconTimelineEvent',
      isNullable: true,
      isUIEditable: false,
      isSystemSideEffect: true,
      targetObjectName: 'opportunity',
      targetFieldName: 'timelineActivities',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'targetOpportunityId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  targetNote: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.MORPH_RELATION,
      morphId: STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
      fieldName: 'targetNote',
      label: i18nLabel(
        msg({ message: `Note`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({ message: `Event target`, context: 'fieldMetadata.description' }),
      ),
      icon: 'IconTimelineEvent',
      isNullable: true,
      isUIEditable: false,
      isSystemSideEffect: true,
      targetObjectName: 'note',
      targetFieldName: 'timelineActivities',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'targetNoteId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  targetTask: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.MORPH_RELATION,
      morphId: STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
      fieldName: 'targetTask',
      label: i18nLabel(
        msg({ message: `Task`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({ message: `Event target`, context: 'fieldMetadata.description' }),
      ),
      icon: 'IconTimelineEvent',
      isNullable: true,
      isUIEditable: false,
      isSystemSideEffect: true,
      targetObjectName: 'task',
      targetFieldName: 'timelineActivities',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'targetTaskId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  targetWorkflowVersion: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.MORPH_RELATION,
      morphId: STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
      fieldName: 'targetWorkflowVersion',
      label: i18nLabel(
        msg({ message: `WorkflowVersion`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({ message: `Event target`, context: 'fieldMetadata.description' }),
      ),
      icon: 'IconTimelineEvent',
      isNullable: true,
      isUIEditable: false,
      isSystemSideEffect: true,
      targetObjectName: 'workflowVersion',
      targetFieldName: 'timelineActivities',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'targetWorkflowVersionId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  targetWorkflowRun: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.MORPH_RELATION,
      morphId: STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
      fieldName: 'targetWorkflowRun',
      label: i18nLabel(
        msg({ message: `WorkflowRun`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({ message: `Event target`, context: 'fieldMetadata.description' }),
      ),
      icon: 'IconTimelineEvent',
      isNullable: true,
      isUIEditable: false,
      isSystemSideEffect: true,
      targetObjectName: 'workflowRun',
      targetFieldName: 'timelineActivities',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'targetWorkflowRunId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  targetDashboard: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.MORPH_RELATION,
      morphId: STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
      fieldName: 'targetDashboard',
      label: i18nLabel(
        msg({ message: `Dashboard`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({ message: `Event target`, context: 'fieldMetadata.description' }),
      ),
      icon: 'IconTimelineEvent',
      isNullable: true,
      isUIEditable: false,
      isSystemSideEffect: true,
      targetObjectName: 'dashboard',
      targetFieldName: 'timelineActivities',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'targetDashboardId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  targetMessageList: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.MORPH_RELATION,
      morphId: STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
      fieldName: 'targetMessageList',
      label: i18nLabel(
        msg({ message: `MessageList`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({ message: `Event target`, context: 'fieldMetadata.description' }),
      ),
      icon: 'IconTimelineEvent',
      isNullable: true,
      isUIEditable: false,
      isSystemSideEffect: true,
      targetObjectName: 'messageList',
      targetFieldName: 'timelineActivities',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'targetMessageListId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  targetMessageCampaign: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.MORPH_RELATION,
      morphId: STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
      fieldName: 'targetMessageCampaign',
      label: i18nLabel(
        msg({ message: `MessageCampaign`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({ message: `Event target`, context: 'fieldMetadata.description' }),
      ),
      icon: 'IconTimelineEvent',
      isNullable: true,
      isUIEditable: false,
      isSystemSideEffect: true,
      targetObjectName: 'messageCampaign',
      targetFieldName: 'timelineActivities',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'targetMessageCampaignId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  searchVector: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'searchVector',
      type: FieldMetadataType.TS_VECTOR,
      label: i18nLabel(
        msg({ message: `Search vector`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Field used for full-text search`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUser',
      isSystem: true,
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
});
