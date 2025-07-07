/**
 * HyperPlays Schema Validation Script
 * Validates all JSON-LD schema files for compliance and accuracy
 */

const fs = require('fs');
const path = require('path');

class HyperPlaysSchemaValidator {
    constructor() {
        this.schemas = [];
        this.errors = [];
        this.warnings = [];
        this.stats = {
            totalFiles: 0,
            validFiles: 0,
            errorsFound: 0,
            warningsFound: 0
        };
    }

    /**
     * Load and validate all schema files
     */
    async validateAll() {
        console.log('🚀 Starting HyperPlays Schema Validation...\n');
        
        const schemaFiles = [
            'organization-schema-with-testimonials.jsonld',
            'person-schema-with-testimonials.jsonld', 
            'person-schema.jsonld',
            'structured_data_service_ai_lead_gen.jsonld',
            'professional-service-schema.jsonld',
            'ai-knowledge-base-schema.jsonld',
            'educational-content-schema.jsonld',
            'work-experience-schema.jsonld',
            'faq-schema-with-testimonials.jsonld'
        ];

        for (const file of schemaFiles) {
            await this.validateFile(file);
        }

        this.printResults();
    }

    /**
     * Validate individual schema file
     */
    async validateFile(filename) {
        this.stats.totalFiles++;
        console.log(`📄 Validating: ${filename}`);

        try {
            if (!fs.existsSync(filename)) {
                this.addError(filename, 'File not found');
                return;
            }

            const content = fs.readFileSync(filename, 'utf8');
            const schema = JSON.parse(content);

            // Basic JSON-LD validation
            this.validateJSONLD(filename, schema);
            
            // HyperPlays specific validation
            this.validateHyperPlaysContent(filename, schema);
            
            // Schema.org compliance
            this.validateSchemaOrg(filename, schema);

            this.stats.validFiles++;
            console.log(`✅ ${filename} - Valid\n`);

        } catch (error) {
            this.addError(filename, `JSON Parse Error: ${error.message}`);
            console.log(`❌ ${filename} - Invalid JSON\n`);
        }
    }

    /**
     * Validate JSON-LD structure
     */
    validateJSONLD(filename, schema) {
        if (!schema['@context']) {
            this.addError(filename, 'Missing @context');
        }
        
        if (!schema['@type']) {
            this.addError(filename, 'Missing @type');
        }

        if (schema['@context'] !== 'https://schema.org') {
            this.addWarning(filename, 'Non-standard @context');
        }
    }

    /**
     * Validate HyperPlays specific content
     */
    validateHyperPlaysContent(filename, schema) {
        // Check for HyperPlays references
        const content = JSON.stringify(schema).toLowerCase();
        
        if (content.includes('gtmexpert') && !content.includes('hyperplays')) {
            this.addWarning(filename, 'Contains GTMExpert references without HyperPlays context');
        }

        // Validate HyperPlays URLs
        if (content.includes('hyper-plays.com')) {
            console.log(`  ✓ HyperPlays URL found`);
        }

        // Check for AI lead generation terms
        const aiTerms = [
            '4-dimensional', 'ai micro-agents', 'hyper-personalization', 
            'trigger-based', 'disc personality', 'sniper-like'
        ];

        const foundTerms = aiTerms.filter(term => content.includes(term.replace('-', '')));
        if (foundTerms.length > 0) {
            console.log(`  ✓ AI methodology terms: ${foundTerms.length}/6`);
        }

        // Validate contact information
        if (content.includes('shashwat@hyperplays.in')) {
            console.log(`  ✓ HyperPlays email found`);
        } else if (content.includes('shashwat@gtmexpert.com')) {
            this.addWarning(filename, 'Using GTMExpert email instead of HyperPlays');
        }
    }

    /**
     * Validate Schema.org compliance
     */
    validateSchemaOrg(filename, schema) {
        const schemaType = schema['@type'];
        
        // Type-specific validations
        switch (schemaType) {
            case 'Organization':
                this.validateOrganization(filename, schema);
                break;
            case 'Person':
                this.validatePerson(filename, schema);
                break;
            case 'Service':
            case 'ProfessionalService':
                this.validateService(filename, schema);
                break;
            case 'Course':
                this.validateCourse(filename, schema);
                break;
            case 'FAQPage':
                this.validateFAQPage(filename, schema);
                break;
            case 'KnowledgeBase':
                this.validateKnowledgeBase(filename, schema);
                break;
        }
    }

    /**
     * Add error
     */
    addError(filename, message) {
        this.errors.push({ file: filename, message });
        this.stats.errorsFound++;
        console.log(`  ❌ ERROR: ${message}`);
    }

    /**
     * Add warning  
     */
    addWarning(filename, message) {
        this.warnings.push({ file: filename, message });
        this.stats.warningsFound++;
        console.log(`  ⚠️  WARNING: ${message}`);
    }

    /**
     * Print validation results
     */
    printResults() {
        console.log('\n' + '='.repeat(60));
        console.log('🎯 HYPERPLAYS SCHEMA VALIDATION RESULTS');
        console.log('='.repeat(60));
        
        console.log(`📊 Statistics:`);
        console.log(`   Total Files: ${this.stats.totalFiles}`);
        console.log(`   Valid Files: ${this.stats.validFiles}`);
        console.log(`   Errors: ${this.stats.errorsFound}`);
        console.log(`   Warnings: ${this.stats.warningsFound}`);
        
        if (this.errors.length > 0) {
            console.log(`\n❌ ERRORS (${this.errors.length}):`);
            this.errors.forEach(error => {
                console.log(`   ${error.file}: ${error.message}`);
            });
        }

        if (this.warnings.length > 0) {
            console.log(`\n⚠️  WARNINGS (${this.warnings.length}):`);
            this.warnings.forEach(warning => {
                console.log(`   ${warning.file}: ${warning.message}`);
            });
        }

        const successRate = (this.stats.validFiles / this.stats.totalFiles * 100).toFixed(1);
        console.log(`\n🎯 Overall Success Rate: ${successRate}%`);
        
        if (this.stats.errorsFound === 0) {
            console.log('✅ All schemas are valid for HyperPlays implementation!');
        } else {
            console.log('❌ Please fix errors before implementation.');
        }
        
        console.log('\n🚀 Ready for AI-powered lead generation optimization!');
    }
}

// Usage
const validator = new HyperPlaysSchemaValidator();
validator.validateAll().catch(console.error);

// Export for use in other scripts
module.exports = HyperPlaysSchemaValidator;
