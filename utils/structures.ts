export type SelectChoice = {
    code: string;
    label: string;
};

export type Definition = {
    field_name: string;
    form_name: string;
    section_header: string;
    field_type: string;
    field_label: string;
    select_choices_or_calculations: SelectChoice[];
    field_note: string;
    text_validation_type_or_show_slider_number: string;
    text_validation_min: string;
    text_validation_max: string;
    identifier: string;
    branching_logic: string;
    required_field: string;
    custom_alignment: string;
    question_number: string;
    matrix_group_name: string;
    matrix_ranking: string;
    field_annotation: string;
};
