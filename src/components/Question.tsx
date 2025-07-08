import React, { memo, useCallback, useMemo } from "react";
import styles from "./Question.module.css";

interface Option {
  id: number;
  text: string;
}

interface QuestionProps {
  question: string;
  options: Option[];
  answer: string;
  selected: string | undefined;
  isAnswered: boolean;
  onSelect: (option: string) => void;
  explanation: string;
}

// Tipos para estados das opções
type OptionState = 'default' | 'selected' | 'correct' | 'incorrect';

// Funções para determinar estado e classes
const getOptionState = (
  optionText: string,
  isSelected: boolean,
  isCorrect: boolean,
  isAnswered: boolean
): OptionState => {
  if (!isAnswered) {
    return isSelected ? 'selected' : 'default';
  }
  if (isCorrect) return 'correct';
  if (isSelected) return 'incorrect';
  return 'default';
};

const getStyleClasses = (state: OptionState) => {
  const baseClasses = {
    default: {
      button: styles.optionButton,
      letter: styles.letter,
      text: styles.text,
    },
    selected: {
      button: styles.optionButtonSelected,
      letter: styles.letterSelected,
      text: styles.textSelected,
    },
    correct: {
      button: styles.optionButtonCorrect,
      letter: styles.letterCorrect,
      text: styles.textSelected,
    },
    incorrect: {
      button: styles.optionButtonIncorrect,
      letter: styles.letterWrong,
      text: styles.textSelected,
    },
  };

  return baseClasses[state];
};

// Componente para uma única opção
interface OptionItemProps {
  option: Option;
  index: number;
  isSelected: boolean;
  isCorrect: boolean;
  isAnswered: boolean;
  onSelect: (optionText: string) => void;
}

const OptionItem: React.FC<OptionItemProps> = memo(({
  option,
  index,
  isSelected,
  isCorrect,
  isAnswered,
  onSelect,
}) => {
  const letter = String.fromCharCode(65 + index);
  const state = getOptionState(option.text, isSelected, isCorrect, isAnswered);
  const styleClasses = getStyleClasses(state);

  const handleClick = useCallback(() => {
    if (!isAnswered) {
      onSelect(option.text);
    }
  }, [isAnswered, onSelect, option.text]);

  const ariaLabel = useMemo(() => {
    let label = `Alternativa ${letter}. ${option.text}`;
    
    if (isAnswered) {
      if (isCorrect) label += ' (correta)';
      else if (isSelected) label += ' (incorreta)';
    } else if (isSelected) {
      label += ' (selecionada)';
    }
    
    return label;
  }, [letter, option.text, isAnswered, isCorrect, isSelected]);

  const showCorrectIcon = isAnswered && isCorrect;
  const showIncorrectIcon = isAnswered && isSelected && !isCorrect;

  return (
    <button
      className={styleClasses.button}
      onClick={handleClick}
      disabled={isAnswered}
      type="button"
      aria-label={ariaLabel}
    >
      <div className={styles.contentContainer}>
        <div className={styleClasses.letter}>
          <span className={styles.letterText}>{letter}</span>
        </div>
        
        <span className={styleClasses.text}>
          {option.text}
        </span>
        
        {showCorrectIcon && (
          <div className={styles.statusIndicator}>
            <span className={styles.statusIcon}>✓</span>
          </div>
        )}
        
        {showIncorrectIcon && (
          <div className={`${styles.statusIndicator} ${styles.statusIndicatorWrong}`}>
            <span className={styles.statusIconWrong}>✗</span>
          </div>
        )}
      </div>
    </button>
  );
});

OptionItem.displayName = 'OptionItem';

// Componente principal otimizado
const Question: React.FC<QuestionProps> = memo(({
  question,
  options,
  answer,
  selected,
  isAnswered,
  onSelect,
  explanation,
}) => {
  // Memoizar as opções processadas
  const processedOptions = useMemo(() => {
    return options.map((option, index) => ({
      ...option,
      index,
      isSelected: selected === option.text,
      isCorrect: option.text === answer,
    }));
  }, [options, selected, answer]);

  return (
    <>
      <div className={styles.questionCard}>
        <span className={styles.questionText}>{question}</span>
      </div>
      
      <div className={styles.optionsContainer}>
        {processedOptions.map((option) => (
          <OptionItem
            key={option.id}
            option={option}
            index={option.index}
            isSelected={option.isSelected}
            isCorrect={option.isCorrect}
            isAnswered={isAnswered}
            onSelect={onSelect}
          />
        ))}
      </div>
      {isAnswered && (
        <div className={styles.explanationCard}>
          <div className={styles.explanationHeader}>
            <h3 className={styles.explanationTitle}>Explicação</h3>
          </div>
          <div className={styles.explanationContainer}>
            <p className={styles.explanationText}>{explanation}</p>
          </div>
        </div>
      )}
    </>
  );
});

Question.displayName = 'Question';

export default Question;